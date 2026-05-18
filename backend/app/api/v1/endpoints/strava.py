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
    user: Annotated[User, Depends(get_authenticated_user)],
    per_page: int = 30,
    page: int = 1
):
    async with httpx.AsyncClient() as client:
        query_params = {
            "per_page": per_page,
            "page": page 
        }
        response = await client.get(
            "https://www.strava.com/api/v3/athlete/activities",
            headers={"Authorization": f"Bearer {user.access_token}"},
            params=query_params
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    activities = response.json()
    simplified_activities = []
    for activity in activities:
        simplified_activities.append({
            "id": activity.get("id"),
            "name": activity.get("name"),
            "type": activity.get("type"),
            "distance": activity.get("distance"),
            "moving_time": activity.get("moving_time"),
            "elapsed_time": activity.get("elapsed_time"),
            "start_date": activity.get("start_date"),
            "summary_polyline": activity.get("map", {}).get("summary_polyline"),
        })


    return simplified_activities 
