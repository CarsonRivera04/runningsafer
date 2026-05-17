from sqlalchemy import Column, ForeignKey, Integer, String

from app.core.database import Base


class UserSession(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, nullable=False)
    token_hash = Column(String, unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    expires_at = Column(Integer, nullable=False)
