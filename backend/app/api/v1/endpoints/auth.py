import os
import time
import httpx
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends, Cookie
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

load_dotenv()

router = APIRouter()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/api/py/auth/callback"
STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize"
STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token"

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

    # sends the browser back to your Next.js home page
    response = RedirectResponse(url="http://localhost:3000/")
    
    # httponly cookie to store user_id (change to jwt in production)
    response.set_cookie(
        key="user_id",
        value=str(athlete["id"]),
        httponly=True,
        samesite="lax",
        path="/",
    )
    
    return response

@router.get("/me")
async def get_current_user(
    user_id: Annotated[str | None, Cookie(alias="user_id")] = None,
    db: Session =  Depends(get_db)
):
    """
    Checks the incoming HttpOnly cookie to see if the user has a valid session.
    """
    if not user_id: 
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user: 
        raise HTTPException(status_code=401, detail="User not found")

    current_time = int(time.time())
    # token is expired 
    if user.expires_at < current_time:
        await refresh_strava_token(user, db)

    return {
        "isAuthenticated": True,
        "user": {
            "id": user.id,
            "firstname": user.firstname,
            "lastname": user.lastname
        }
    }

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
