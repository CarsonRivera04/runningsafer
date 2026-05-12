from fastapi import FastAPI
from app.schemas import Status  # Clean import thanks to __init__.py

app = FastAPI()

@app.get("/api/py/healthcheck", response_model=Status)
async def healthcheck():
    return {"message": "Backend is connected!", "status": "ok"}