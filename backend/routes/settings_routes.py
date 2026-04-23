from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from models.settings import (
    SiteSettings,
    SiteSettingsUpdate,
    SiteSettingsResponse,
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import os

router = APIRouter(prefix="/settings", tags=["settings"])


# Simple auth check
def verify_admin_token(x_admin_token: Optional[str] = Header(None)):
    admin_password = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
    if x_admin_token != admin_password:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# Dependency to get database
async def get_db():
    from server import db
    return db


# Get site settings (public)
@router.get("", response_model=SiteSettingsResponse)
async def get_settings(db: AsyncIOMotorDatabase = Depends(get_db)):
    settings = await db.settings.find_one({})
    if not settings:
        # Return default settings
        default_settings = SiteSettings()
        await db.settings.insert_one(default_settings.dict())
        return default_settings.dict()
    return SiteSettings(**settings).dict()


# Update site settings (admin only)
@router.put("", response_model=SiteSettingsResponse)
async def update_settings(
    settings_data: SiteSettingsUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    settings = await db.settings.find_one({})
    
    if not settings:
        # Create new settings
        new_settings = SiteSettings(**settings_data.dict(exclude_unset=True))
        await db.settings.insert_one(new_settings.dict())
        return new_settings.dict()
    
    # Update existing settings
    update_data = settings_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.settings.update_one({}, {"$set": update_data})
    
    updated_settings = await db.settings.find_one({})
    return SiteSettings(**updated_settings).dict()


# Initialize default settings
@router.post("/initialize")
async def initialize_settings(
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    existing = await db.settings.find_one({})
    if existing:
        return {"message": "Settings already initialized"}
    
    default_settings = SiteSettings()
    await db.settings.insert_one(default_settings.dict())
    return {"message": "Settings initialized successfully"}
