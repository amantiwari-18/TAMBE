from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from models.settings import (
    SiteSettings,
    SiteSettingsUpdate,
    SiteSettingsResponse,
)

from datetime import datetime, timezone
import os
from json_storage import settings_storage

router = APIRouter(prefix="/settings", tags=["settings"])


# Simple auth check
def verify_admin_token(x_admin_token: Optional[str] = Header(None)):
    admin_password = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
    if x_admin_token != admin_password:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True



# Get site settings (public)
@router.get("", response_model=SiteSettingsResponse)
async def get_settings():
    settings = settings_storage.get()
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
    _: bool = Depends(verify_admin_token),
):
    settings = settings_storage.get()
    
    if not settings:
        # Create new settings
        new_settings = SiteSettings(**settings_data.dict(exclude_unset=True))
        await db.settings.insert_one(new_settings.dict())
        return new_settings.dict()
    
    # Update existing settings
    update_data = settings_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.settings.update_one({}, {"$set": update_data})
    
    updated_settings = settings_storage.get()
    return SiteSettings(**updated_settings).dict()


# Initialize default settings
@router.post("/initialize")
async def initialize_settings(
    _: bool = Depends(verify_admin_token),
):
    existing = settings_storage.get()
    if existing:
        return {"message": "Settings already initialized"}
    
    default_settings = SiteSettings()
    await db.settings.insert_one(default_settings.dict())
    return {"message": "Settings initialized successfully"}
