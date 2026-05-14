# app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1.endpoints import health, auth 

api_router = APIRouter()

# You can add prefixes and tags here to keep the docs organized
api_router.include_router(health.router, prefix="/py", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])