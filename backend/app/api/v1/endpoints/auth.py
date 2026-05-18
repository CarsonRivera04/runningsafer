import os
import httpx
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends, Cookie
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

from app.utils.auth import (
    create_user_session,
    delete_user_session,
    get_authenticated_user,
)

load_dotenv()

router = APIRouter()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/api/py/auth/callback"
STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize"
STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token"
SESSION_COOKIE_NAME = "session"
SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"



@router.get("/login")
async def login():
    """
    Redirect the user to Strava's authorization page.
    """
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "approval_prompt": "auto",
        "scope": "activity:read" # Add scopes as needed
    }
    # Construct the URL and redirect
    url = httpx.URL(STRAVA_AUTH_URL, params=params)
    return RedirectResponse(url)

@router.get("/callback")
async def callback(code: str, db: Session = Depends(get_db)):
    """
    Handle the callback from Strava after user authorization.
    """
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not found")

    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(STRAVA_TOKEN_URL, data=payload)
        
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to retrieve token")

    token_data = response.json()
    athlete = token_data["athlete"]

    # Check if user exists, if so update. If not, create.
    user = db.query(User).filter(User.id == athlete["id"]).first()
    
    if not user:
        user = User(
            id=athlete["id"],
            firstname=athlete.get("firstname"),
            lastname=athlete.get("lastname"),
            access_token=token_data["access_token"],
            refresh_token=token_data["refresh_token"],
            expires_at=token_data["expires_at"]
        )
        db.add(user)
    else:
        # Update tokens for returning user
        user.access_token = token_data["access_token"]
        user.refresh_token = token_data["refresh_token"]
        user.expires_at = token_data["expires_at"]
    
    db.commit()
    db.refresh(user)

    # sends the browser back to your Next.js home page
    response = RedirectResponse(url="http://localhost:3000/")
    session_token = create_user_session(user, db)
    
    # Store only an opaque session token in the browser. The DB stores its hash.
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_token,
        httponly=True,
        secure=SESSION_COOKIE_SECURE,
        samesite="lax",
        path="/",
        max_age=SESSION_DURATION_SECONDS,
    )
    response.delete_cookie(key="user_id", path="/")
    
    return response


@router.post("/logout")
async def logout(
    session_token: Annotated[str | None, Cookie(alias=SESSION_COOKIE_NAME)] = None,
    db: Session = Depends(get_db),
):
    """End the current session and clear the session cookie."""
    delete_user_session(session_token, db)

    response = RedirectResponse(url="http://localhost:3000/login", status_code=302)
    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=SESSION_COOKIE_SECURE,
        samesite="lax",
    )
    return response


@router.get("/me")
async def get_current_user(
    user: Annotated[User, Depends(get_authenticated_user)]
):
    """
    Checks the incoming HttpOnly cookie to see if the user has a valid session.
    """
    return {
        "isAuthenticated": True,
        "user": {
            "id": user.id,
            "firstname": user.firstname,
            "lastname": user.lastname
        }
    }
