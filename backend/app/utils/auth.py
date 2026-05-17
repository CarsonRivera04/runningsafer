import time
import os
import hashlib
import secrets
import httpx
from app.models.session import UserSession
from app.models.user import User
from sqlalchemy.orm import Session
from fastapi import Cookie, Depends, HTTPException
from typing import Annotated
from app.core.database import get_db

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token"
SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30
SESSION_COOKIE_NAME = "session"

def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_user_session(user: User, db: Session) -> str:
    session_token = secrets.token_urlsafe(32)
    session = UserSession(
        token_hash=hash_session_token(session_token),
        user_id=user.id,
        expires_at=int(time.time()) + SESSION_DURATION_SECONDS,
    )
    db.add(session)
    db.commit()

    return session_token


async def get_authenticated_user(
    session_token: Annotated[str | None, Cookie(alias=SESSION_COOKIE_NAME)] = None,
    db: Session = Depends(get_db),
) -> User:
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = db.query(UserSession).filter(
        UserSession.token_hash == hash_session_token(session_token)
    ).first()

    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    if session.expires_at < int(time.time()):
        db.delete(session)
        db.commit()
        raise HTTPException(status_code=401, detail="Session expired")

    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    current_time = int(time.time())
    if user.expires_at < current_time:
        await refresh_strava_token(user, db)

    return user

async def refresh_strava_token(user: User, db: Session):
    """Helper function to refresh Strava tokens"""
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": user.refresh_token
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(STRAVA_TOKEN_URL, data=payload)
        
    if response.status_code == 200:
        data = response.json()
        user.access_token = data["access_token"]
        user.refresh_token = data["refresh_token"]
        user.expires_at = data["expires_at"]
        db.commit()