import os
from fastapi import APIRouter, HTTPException 
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.get("/envcheck")
async def envcheck():
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")

    missing_vars = []
    if not client_id:
        missing_vars.append("CLIENT_ID")
    if not client_secret:
        missing_vars.append("CLIENT_SECRET")

    if missing_vars:
        raise HTTPException(
            status_code=500, 
            detail=f"Missing environment variables: {', '.join(missing_vars)}"
        )

    return {
        "status": "ok",
        "message": "Backend is connected and environment variables are set.",
        "verified_vars": ["CLIENT_ID", "CLIENT_SECRET"]
    }