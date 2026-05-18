import httpx
import polyline
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
    per_page: int = 30, # keep requesting until number requested by fronend is met
    page: int = 1
):
    target_types = {"Run", "Ride", "Walk"}
    simplified_activities = []
    required_total_items = page * per_page
    strava_page = 1
    
    async with httpx.AsyncClient() as client:
        # keep fetching from strava until we have enough items to satisfy the requested page and per_page
        while len(simplified_activities) < required_total_items:
            response = await client.get(
                "https://www.strava.com/api/v3/athlete/activities",
                headers={"Authorization": f"Bearer {user.access_token}"},
                params={
                    "per_page": 50, # fetch in batches of 50 to minimize number of requests while ensuring we get enough items
                    "page": strava_page
                }
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)

            raw_activities = response.json()
            
            # if strava returns an empty list, it means we've fetched all available activities
            if not raw_activities:
                break

            for activity in raw_activities:
                summary_polyline = activity.get("map", {}).get("summary_polyline")
                
                if activity.get("type") in target_types and summary_polyline:
                    simplified_activities.append({
                        "id": activity.get("id"),
                        "name": activity.get("name"),
                        "type": activity.get("type"),
                        "distance": activity.get("distance"),
                        "moving_time": activity.get("moving_time"),
                        "elapsed_time": activity.get("elapsed_time"),
                        "start_date": activity.get("start_date"),
                        "summary_polyline": summary_polyline,  # Insert the verified polyline
                        "coordinates": polyline.decode(summary_polyline)  
                    })

            # move to the next page of strava results for the next iteration if we still need more items
            strava_page += 1

    # return only the slice of activities that corresponds to the requested page and per_page
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    return simplified_activities[start_idx:end_idx]