import os
import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Replace these with your Strava App credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/api/auth/callback"
STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize"
STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token"

@router.get("/login")
async def login():
    """
    Step 1: Redirect the user to Strava's authorization page.
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
async def callback(code: str):
    """
    Step 2: Strava redirects back here with a 'code'.
    Step 3: Exchange that code for an Access Token and Refresh Token.
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
        raise HTTPException(status_code=400, detail="Failed to retrieve token from Strava")

    token_data = response.json()
    
    # token_data contains: access_token, refresh_token, expires_at, and athlete info
    # In a real app, you should save these to a database indexed by user
    return {
        "message": "Successfully authenticated!",
        "access_token": token_data["access_token"],
        "refresh_token": token_data["refresh_token"],
        "expires_at": token_data["expires_at"],
        "athlete": token_data["athlete"]
    }