from fastapi import APIRouter
from app.schemas import Status

router = APIRouter()

@router.get("/healthcheck", response_model=Status)
async def healthcheck():
    return {"message": "Backend is connected!", "status": "ok"}