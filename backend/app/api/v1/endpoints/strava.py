import httpx
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from app.models.user import User
from app.utils.auth import (
    get_authenticated_user
)

router = APIRouter()

@router.get("/activities")
async def get_activities(
    user: Annotated[User, Depends(get_authenticated_user)]
):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.strava.com/api/v3/athlete/activities",
            headers={"Authorization": f"Bearer {user.access_token}"}
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()
