import httpx
import requests
import polyline
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Annotated
from app.models.user import User
from app.utils.auth import (
    get_authenticated_user
)

router = APIRouter()

@router.get("/details")
async def get_details(
    summary_polyline: str = Query(..., description="Encoded Strava summary polyline"),
    radius_meters: int = 15
):
    try:
        parsed_coordinates = polyline.decode(summary_polyline)
    except (IndexError, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid summary polyline.")

    if not parsed_coordinates:
        raise HTTPException(status_code=400, detail="Summary polyline does not contain coordinates.")

    sampled_coordinates = parsed_coordinates[::10]

    OVERPASS_URL = "https://overpass-api.de/api/interpreter"

    lat_lon_queries = "".join([
        f'way(around:{radius_meters},{lat},{lon})["highway"];' 
        for lat, lon in sampled_coordinates
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
        sidewalk = tags.get('sidewalk', 'unknown')
        sidewalk_right = tags.get('sidewalk:right', 'unknown')
        sidewalk_left = tags.get('sidewalk:left', 'unknown')
        sidewalk_both = tags.get('sidewalk:both', 'unknown')
        
        # Extract coordinates fetched via 'out geom'
        geometry = way.get('geometry', [])
        coordinates_list = [(pt['lat'], pt['lon']) for pt in geometry]

        if coordinates_list:
            closest_parsed_point = min(
                parsed_coordinates,
                key=lambda parsed_point: min(
                    (parsed_point[0] - geom_point[0]) ** 2 + (parsed_point[1] - geom_point[1]) ** 2
                    for geom_point in coordinates_list
                )
            )
        else:
            closest_parsed_point = parsed_coordinates[0]

        geo_objects.append({
            "name": name,
            "highway_type": highway_type,
            "sidewalk": sidewalk,
            "sidewalk_right": sidewalk_right,
            "sidewalk_left": sidewalk_left,
            "sidewalk_both": sidewalk_both,
            "coordinates": coordinates_list,
            "closest_lat": closest_parsed_point[0],
            "closest_lon": closest_parsed_point[1],
        })

    # highway types 
    H_TIER_1 = {"corridor": "For a hallway inside of a building.", 
                "pedestrian": "For roads used mainly/exclusively for pedestrians in shopping and some residential areas which may allow access by motorised vehicles only for very limited periods of the day.", 
                "footway" : "For designated footpaths; i.e., mainly/exclusively for pedestrians. This includes walking tracks and gravel paths.", 
                "sidewalk": "Sidewalk that runs typically along residential road."}
    H_TIER_2 = {"living_street": "For living streets, which are residential streets where pedestrians have legal priority over cars, speeds are kept very low.", 
                "bridleway": "For horse riders. Pedestrians are usually also permitted, cyclists may be permitted depending on local rules/laws. Motor vehicles are forbidden.",
                "residential": "Roads which serve as an access to housing, without function of connecting settlements. Often lined with housing.",
                "track": "Roads for mostly agricultural or forestry uses."}
    H_TIER_3 = {"path": "A non-specific path.", 
                "traffic_island": "The way between two crossings, safespot for pedestrians.", 
                "crossing": "Crosswalk that connects two sidewalks on the opposite side of the road. Often recognized by painted markings on the road, road sign or traffic lights.",
                "tertiary": "The next most important roads in a country's system. (Often link smaller towns and villages) ",
                "unclassified": "The least important through roads in a country's system – i.e. minor roads of a lower classification than tertiary, but which serve a purpose other than access to properties. (Often link villages and hamlets.)",
                "service": "For access roads to, or within an industrial estate, camp site, business park, car park, alleys, etc."}
    H_TIER_4 = {"steps": "For flights of steps (stairs) on footways.", 
                "via_ferrata": "A via ferrata is a route equipped with fixed cables, stemples, ladders, and bridges in order to increase ease and security for climbers. These via ferrata require equipment : climbing harness, shock absorber and two short lengths of rope, but do not require a long rope as for climbing.",
                "motorway": "A restricted access major divided highway, normally with 2 or more running lanes plus emergency hard shoulder. Equivalent to the Freeway, Autobahn, etc..",
                "trunk": "The most important roads in a country's system that aren't motorways. (Need not necessarily be a divided highway.)",
                "primary": "The next most important roads in a country's system. (Often link larger towns.)",
                "secondary": "The next most important roads in a country's system. (Often link towns.)",
                "motorway_link": "The link roads (sliproads/ramps) leading to/from a motorway from/to a motorway or lower class highway. Normally with the same motorway restrictions.",
                "trunk_link": "The link roads (sliproads/ramps) leading to/from a trunk road from/to a trunk road or lower class highway.",
                "primary_link": "The link roads (sliproads/ramps) leading to/from a primary road from/to a primary road or lower class highway.",
                "secondary_link": "The link roads (sliproads/ramps) leading to/from a secondary road from/to a secondary road or lower class highway.",
                "tertiary_link": "The link roads (sliproads/ramps) leading to/from a tertiary road from/to a tertiary road or lower class highway.",
                "bus_guideway": "A busway where the vehicle guided by the way (though not a railway) and is not suitable for other traffic. Please note: this is not a normal bus lane, use access=no, psv=yes instead! If the buses are not guided, consider highway=busway.",
                "escape": "For runaway truck ramps, runaway truck lanes, emergency escape ramps, or truck arrester beds. It enables vehicles with braking failure to safely stop.",
                "raceway": "A course or track for (motor) racing.",
                "road": "A road/way/street/motorway/etc. of unknown type. It can stand for anything ranging from a footpath to a motorway.",
                "busway": "A dedicated roadway for bus rapid transit systems"}
    
    H_TIERS = {**H_TIER_1, **H_TIER_2, **H_TIER_3, **H_TIER_4}

    # sidewalk types
    S_TIER_1 = {"both": "Both sides of the street have sidewalks."}
    S_TIER_2 = {"right": "Only a sidewalk on the right side of the way representing the street.", 
                "left": "Only a sidewalk on the left side of the way representing the street.", 
                "separate": "Either both sides or one side of this street have sidewalks.", 
                "yes": "Either both sides or one side of this street have sidewalks."}
    S_TIER_3 = {"lane": "Either both sides or one side of this street have a lane dedicated for pedestrian movement."}
    S_TIER_4 = {"no": "There is no sidewalk at all.", 
                "none": "There is no sidewalk at all.",}
    
    S_TIERS = {**S_TIER_1, **S_TIER_2, **S_TIER_3, **S_TIER_4}

    for obj in geo_objects:

        obj["highway_caption"] = H_TIERS.get(obj["highway_type"], "unknown")
        obj["sidewalk_caption"] = S_TIERS.get(obj["sidewalk"], "unknown")


        if obj["highway_type"] in H_TIER_1 or obj["sidewalk"] in S_TIER_1 or obj["sidewalk_right"] in S_TIER_1 or obj["sidewalk_left"] in S_TIER_1 or obj["sidewalk_both"] in S_TIER_1:
            obj["score"] = 1
        elif obj["highway_type"] in H_TIER_2 or obj["sidewalk"] in S_TIER_2 or obj["sidewalk_right"] in S_TIER_2 or obj["sidewalk_left"] in S_TIER_2 or obj["sidewalk_both"] in S_TIER_2:
            obj["score"] = 2 
        elif obj["highway_type"] in H_TIER_3 or obj["sidewalk"] in S_TIER_3 or obj["sidewalk_right"] in S_TIER_3 or obj["sidewalk_left"] in S_TIER_3 or obj["sidewalk_both"] in S_TIER_3:
            obj["score"] = 3 
        else: 
            obj["score"] = 4
    
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
