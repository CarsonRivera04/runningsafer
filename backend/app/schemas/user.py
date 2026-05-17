from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    id: int 
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    username: Optional[str] = None
    access_token: str
    refresh_token: str
    expires_at: int
    model_config = {"from_attributes": True}

class UserRead(BaseModel):
    id: int
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    username: Optional[str] = None
    model_config = {"from_attributes": True}