from fastapi import APIRouter, HTTPException, Depends, Header
from typing import List, Optional
from models.theme import (
    Theme,
    ThemeCreate,
    ThemeUpdate,
    ThemeResponse,
    ColorSettings,
    FontSettings,
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import os

router = APIRouter(prefix="/themes", tags=["themes"])


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


# Get all themes
@router.get("", response_model=List[ThemeResponse])
async def get_themes(db: AsyncIOMotorDatabase = Depends(get_db)):
    themes = await db.themes.find().to_list(100)
    return [Theme(**theme).dict() for theme in themes]


# Get active theme
@router.get("/active", response_model=ThemeResponse)
async def get_active_theme(db: AsyncIOMotorDatabase = Depends(get_db)):
    theme = await db.themes.find_one({"is_active": True})
    if not theme:
        # Return default theme if no active theme
        return get_default_theme("Industrial Dark")
    return Theme(**theme).dict()


# Get theme by ID
@router.get("/{theme_id}", response_model=ThemeResponse)
async def get_theme(theme_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    theme = await db.themes.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    return Theme(**theme).dict()


# Create new theme (admin only)
@router.post("", response_model=ThemeResponse)
async def create_theme(
    theme_data: ThemeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    theme = Theme(**theme_data.dict())
    await db.themes.insert_one(theme.dict())
    return theme.dict()


# Update theme (admin only)
@router.put("/{theme_id}", response_model=ThemeResponse)
async def update_theme(
    theme_id: str,
    theme_data: ThemeUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    theme = await db.themes.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    update_data = theme_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()

    await db.themes.update_one({"id": theme_id}, {"$set": update_data})

    updated_theme = await db.themes.find_one({"id": theme_id})
    return Theme(**updated_theme).dict()


# Set active theme (admin only)
@router.post("/{theme_id}/activate", response_model=ThemeResponse)
async def activate_theme(
    theme_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    theme = await db.themes.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    # Deactivate all themes
    await db.themes.update_many({}, {"$set": {"is_active": False}})

    # Activate selected theme
    await db.themes.update_one({"id": theme_id}, {"$set": {"is_active": True}})

    updated_theme = await db.themes.find_one({"id": theme_id})
    return Theme(**updated_theme).dict()


# Delete theme (admin only)
@router.delete("/{theme_id}")
async def delete_theme(
    theme_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    theme = await db.themes.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    if theme.get("is_preset"):
        raise HTTPException(status_code=400, detail="Cannot delete preset themes")

    if theme.get("is_active"):
        raise HTTPException(
            status_code=400, detail="Cannot delete active theme. Activate another theme first."
        )

    await db.themes.delete_one({"id": theme_id})
    return {"message": "Theme deleted successfully"}


# Get preset themes
@router.get("/presets/all", response_model=List[ThemeResponse])
async def get_presets():
    presets = [
        get_default_theme("Industrial Dark"),
        get_default_theme("Clean Light"),
        get_default_theme("High Contrast"),
    ]
    return presets


# Helper function to get default themes
def get_default_theme(preset_name: str) -> dict:
    presets = {
        "Industrial Dark": Theme(
            id=f"preset-industrial-dark",
            name="Industrial Dark",
            colors=ColorSettings(
                primary="#D4AF37",  # Rich Gold
                secondary="#FFFFFF",
                background="#0A0E17",  # Deep Navy Black
                background_secondary="#141B2D",  # Dark Blue Gray
                text_primary="#FFFFFF",
                text_secondary="rgba(255, 255, 255, 0.85)",
                text_muted="rgba(255, 255, 255, 0.6)",
                button_bg="#D4AF37",  # Gold
                button_text="#0A0E17",  # Dark
                button_hover_bg="#F4D03F",  # Lighter Gold
                button_hover_text="#0A0E17",
                border="rgba(212, 175, 55, 0.2)",  # Gold tint
            ),
            fonts=FontSettings(
                family="Inter",
                h1_size="66px",
                h2_size="48px",
                h3_size="32px",
                body_size="18px",
                button_size="18px",
            ),
            is_active=True,
            is_preset=True,
        ),
        "Clean Light": Theme(
            id=f"preset-clean-light",
            name="Clean Light",
            colors=ColorSettings(
                primary="#1E3A8A",  # Deep Blue
                secondary="#000000",
                background="#F9FAFB",  # Light Gray
                background_secondary="#FFFFFF",
                text_primary="#111827",  # Almost Black
                text_secondary="rgba(0, 0, 0, 0.8)",
                text_muted="rgba(0, 0, 0, 0.6)",
                button_bg="#1E3A8A",
                button_text="#FFFFFF",
                button_hover_bg="#1E40AF",
                button_hover_text="#FFFFFF",
                border="rgba(30, 58, 138, 0.2)",
            ),
            fonts=FontSettings(
                family="Poppins",
                h1_size="64px",
                h2_size="48px",
                h3_size="32px",
                body_size="16px",
                button_size="16px",
            ),
            is_active=False,
            is_preset=True,
        ),
        "High Contrast": Theme(
            id=f"preset-high-contrast",
            name="High Contrast",
            colors=ColorSettings(
                primary="#FBBF24",  # Amber Gold
                secondary="#FFFFFF",
                background="#000000",
                background_secondary="#1F2937",  # Dark Gray
                text_primary="#FFFFFF",
                text_secondary="#F3F4F6",
                text_muted="rgba(255, 255, 255, 0.8)",
                button_bg="#FBBF24",
                button_text="#000000",
                button_hover_bg="#FCD34D",
                button_hover_text="#000000",
                border="rgba(251, 191, 36, 0.3)",
            ),
            fonts=FontSettings(
                family="Roboto",
                h1_size="72px",
                h2_size="52px",
                h3_size="36px",
                body_size="20px",
                button_size="20px",
            ),
            is_active=False,
            is_preset=True,
        ),
    }

    return presets.get(preset_name).dict()


# Initialize preset themes
@router.post("/presets/initialize")
async def initialize_presets(
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    # Check if presets already exist
    existing_presets = await db.themes.find({"is_preset": True}).to_list(10)
    if existing_presets:
        return {"message": "Presets already initialized", "count": len(existing_presets)}

    presets = [
        get_default_theme("Industrial Dark"),
        get_default_theme("Clean Light"),
        get_default_theme("High Contrast"),
    ]

    for preset in presets:
        await db.themes.insert_one(preset)

    return {"message": "Presets initialized successfully", "count": len(presets)}
