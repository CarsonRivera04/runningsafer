# app/main.py
from fastapi import FastAPI
from app.api.v1.api import api_router

app = FastAPI(title="My Project API", docs_url="/api/py/docs")

# This includes all v1 routes under the /api base path
app.include_router(api_router, prefix="/api/py")