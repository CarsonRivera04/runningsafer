# app/main.py
from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.database import Base, engine
from app.models import user

app = FastAPI(title="Safer Strava API", docs_url="/api/py/docs")

# This includes all v1 routes under the /api base path
app.include_router(api_router, prefix="/api/py")

Base.metadata.create_all(bind=engine)