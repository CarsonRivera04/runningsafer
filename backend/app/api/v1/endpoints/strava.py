import httpx
import requests
import polyline
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from app.models.user import User
from app.utils.auth import (
    get_authenticated_user
)

router = APIRouter()

@router.get("/details")
async def get_details(
    coordinates: list[tuple[float, float]],
    radius_meters: int = 15
):
    OVERPASS_URL = "https://overpass-api.de/api/interpreter"
    
    coordinates = coordinates[::10]
    lat_lon_queries = "".join([
        f'way(around:{radius_meters},{lat},{lon})["highway"];' 
        for lat, lon in coordinates
    ])

    
    query = f"""
    [out:json][timeout:60];
    (
      {lat_lon_queries}
    );
    out geom;
    """
    
    print("Fetching pedestrian safety data from Overpass API...")
    response = requests.get(
        OVERPASS_URL,
        params={"data": query},
        headers={"User-Agent": "Safer Strava Pedestrian (carsonrivera04@gmail.com)"},
        timeout=30,
    )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=f"Overpass API request failed with status {response.status_code}: {response.text}")
    
    data = response.json()

    geo_objects = []

    elements = data.get('elements', [])
    ways = [e for e in elements if e['type'] == 'way']
    for way in ways:
        tags = way.get('tags', {})
        name = tags.get('name', 'Unnamed Path/Road')
        highway_type = tags.get('highway', 'unknown')
        
        # Extract coordinates fetched via 'out geom'
        geometry = way.get('geometry', [])
        coordinates_list = [(pt['lat'], pt['lon']) for pt in geometry]
        bounds = way.get('bounds', {})

        geo_objects.append({
            "name": name,
            "highway_type": highway_type,
            "coordinates": coordinates_list,
            "tags": tags,
            "bounds": bounds
        })
    
    return geo_objects



@router.get("/activities/{activity_id}")
async def get_activity(
    user: Annotated[User, Depends(get_authenticated_user)],
    activity_id: int
):
    async with httpx.AsyncClient() as client: 
        response = await client.get(
            f"https://www.strava.com/api/v3/activities/{activity_id}",
            headers={"Authorization": f"Bearer {user.access_token}"}
        )

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to retrieve activity")

    object = response.json()
    if (object.get("type") not in {"Run", "Walk"}):
        raise HTTPException(status_code=400, detail="Activity type not supported")
    
    if (object.get("map", {}).get("summary_polyline") is None):
        raise HTTPException(status_code=400, detail="Activity does not contain a summary polyline")

    activity = {
        "id": object.get("id"),
        "name": object.get("name"),
        "type": object.get("type"),
        "distance": object.get("distance"),
        "moving_time": object.get("moving_time"),
        "elapsed_time": object.get("elapsed_time"),
        "start_date": object.get("start_date"),
        "summary_polyline": object.get("map", {}).get("summary_polyline"),  
        "coordinates": polyline.decode(object.get("map", {}).get("summary_polyline"))  
    }

    return activity

@router.get("/activities")
async def get_activities(
    user: Annotated[User, Depends(get_authenticated_user)],
    per_page: int = 30, # keep requesting until number requested by fronend is met
    page: int = 1
):
    target_types = {"Run", "Walk"}
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