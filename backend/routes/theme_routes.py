from fastapi import APIRouter, HTTPException, Header, Depends
from typing import List, Optional
from models.theme import (
    Theme,
    ThemeCreate,
    ThemeUpdate,
    ThemeResponse,
    ColorSettings,
    FontSettings,
)
from datetime import datetime, timezone
import os
from json_storage import themes_storage

router = APIRouter(prefix="/themes", tags=["themes"])


# Simple auth check
def verify_admin_token(x_admin_token: Optional[str] = Header(None)):
    admin_password = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
    if x_admin_token != admin_password:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# Get all themes
@router.get("", response_model=List[ThemeResponse])
async def get_themes():
    themes = themes_storage.find_all()
    return [Theme(**theme).dict() for theme in themes]


# Get active theme
@router.get("/active", response_model=ThemeResponse)
async def get_active_theme():
    theme = themes_storage.find_one({"is_active": True})
    if not theme:
        # Return default theme if no active theme
        return get_default_theme("Industrial Dark")
    return Theme(**theme).dict()


# Get theme by ID
@router.get("/{theme_id}", response_model=ThemeResponse)
async def get_theme(theme_id: str):
    theme = themes_storage.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    return Theme(**theme).dict()


# Create new theme (admin only)
@router.post("", response_model=ThemeResponse)
async def create_theme(
    theme_data: ThemeCreate,
    _: bool = Depends(verify_admin_token),
):
    theme = Theme(**theme_data.dict())
    themes_storage.insert_one(theme.dict())
    return theme.dict()


# Update theme (admin only)
@router.put("/{theme_id}", response_model=ThemeResponse)
async def update_theme(
    theme_id: str,
    theme_data: ThemeUpdate,
    _: bool = Depends(verify_admin_token),
):
    theme = themes_storage.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    update_data = theme_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    themes_storage.update_one({"id": theme_id}, update_data)

    updated_theme = themes_storage.find_one({"id": theme_id})
    return Theme(**updated_theme).dict()


# Set active theme (admin only)
@router.post("/{theme_id}/activate", response_model=ThemeResponse)
async def activate_theme(
    theme_id: str,
    _: bool = Depends(verify_admin_token),
):
    theme = themes_storage.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    # Deactivate all themes
    all_themes = themes_storage.find_all()
    for t in all_themes:
        if t.get("is_active"):
            themes_storage.update_one({"id": t["id"]}, {"is_active": False})

    # Activate the selected theme
    themes_storage.update_one({"id": theme_id}, {"is_active": True})

    updated_theme = themes_storage.find_one({"id": theme_id})
    return Theme(**updated_theme).dict()


# Delete theme (admin only)
@router.delete("/{theme_id}")
async def delete_theme(
    theme_id: str,
    _: bool = Depends(verify_admin_token),
):
    theme = themes_storage.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    # Prevent deletion of preset themes
    if theme.get("is_preset", False):
        raise HTTPException(status_code=400, detail="Cannot delete preset themes")

    # Prevent deletion of active theme
    if theme.get("is_active", False):
        raise HTTPException(
            status_code=400, detail="Cannot delete active theme. Please activate another theme first."
        )

    themes_storage.delete_one({"id": theme_id})
    return {"message": "Theme deleted successfully"}


# Get theme presets
@router.get("/presets/list", response_model=List[ThemeResponse])
async def get_theme_presets():
    """Get all preset themes"""
    presets = [
        get_default_theme("Industrial Dark"),
        get_default_theme("Luxury Gold"),
        get_default_theme("Electric Blue"),
        get_default_theme("Carbon Black"),
    ]
    return presets


# Initialize preset themes
@router.post("/presets/initialize")
async def initialize_presets(_: bool = Depends(verify_admin_token)):
    """Initialize default preset themes if they don't exist"""
    preset_names = ["Industrial Dark", "Luxury Gold", "Electric Blue", "Carbon Black"]
    
    for name in preset_names:
        preset_id = f"preset-{name.lower().replace(' ', '-')}"
        existing = themes_storage.find_one({"id": preset_id})
        
        if not existing:
            preset = get_default_theme(name)
            themes_storage.insert_one(preset)
    
    # If no active theme, set Industrial Dark as active
    active_theme = themes_storage.find_one({"is_active": True})
    if not active_theme:
        themes_storage.update_one(
            {"id": "preset-industrial-dark"},
            {"is_active": True}
        )
    
    return {"message": "Preset themes initialized successfully"}


def get_default_theme(name: str = "Industrial Dark") -> dict:
    """Get default theme configuration"""
    themes_map = {
        "Industrial Dark": {
            "id": "preset-industrial-dark",
            "name": "Industrial Dark",
            "colors": {
                "primary": "#00FFD1",
                "secondary": "#FFFFFF",
                "background": "#000000",
                "background_secondary": "#121212",
                "text_primary": "#FFFFFF",
                "text_secondary": "rgba(255, 255, 255, 0.8)",
                "text_muted": "rgba(255, 255, 255, 0.6)",
                "button_bg": "#00FFD1",
                "button_text": "#000000",
                "button_hover_bg": "#FFFFFF",
                "button_hover_text": "#000000",
                "border": "rgba(255, 255, 255, 0.1)",
            },
            "fonts": {
                "family": "Inter",
                "h1_size": "66px",
                "h2_size": "48px",
                "h3_size": "32px",
                "body_size": "18px",
                "button_size": "18px",
            },
            "is_active": False,
            "is_preset": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": None,
        },
        "Luxury Gold": {
            "id": "preset-luxury-gold",
            "name": "Luxury Gold",
            "colors": {
                "primary": "#D4AF37",
                "secondary": "#1A2332",
                "background": "#0A0E17",
                "background_secondary": "#141B2D",
                "text_primary": "#FFFFFF",
                "text_secondary": "rgba(255, 255, 255, 0.85)",
                "text_muted": "rgba(255, 255, 255, 0.6)",
                "button_bg": "#D4AF37",
                "button_text": "#0A0E17",
                "button_hover_bg": "#F4D03F",
                "button_hover_text": "#0A0E17",
                "border": "rgba(212, 175, 55, 0.2)",
            },
            "fonts": {
                "family": "Inter",
                "h1_size": "66px",
                "h2_size": "48px",
                "h3_size": "32px",
                "body_size": "18px",
                "button_size": "18px",
            },
            "is_active": False,
            "is_preset": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": None,
        },
        "Electric Blue": {
            "id": "preset-electric-blue",
            "name": "Electric Blue",
            "colors": {
                "primary": "#00A3FF",
                "secondary": "#1E3A5F",
                "background": "#0B1929",
                "background_secondary": "#152238",
                "text_primary": "#FFFFFF",
                "text_secondary": "rgba(255, 255, 255, 0.85)",
                "text_muted": "rgba(255, 255, 255, 0.6)",
                "button_bg": "#00A3FF",
                "button_text": "#FFFFFF",
                "button_hover_bg": "#0080CC",
                "button_hover_text": "#FFFFFF",
                "border": "rgba(0, 163, 255, 0.2)",
            },
            "fonts": {
                "family": "Inter",
                "h1_size": "66px",
                "h2_size": "48px",
                "h3_size": "32px",
                "body_size": "18px",
                "button_size": "18px",
            },
            "is_active": False,
            "is_preset": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": None,
        },
        "Carbon Black": {
            "id": "preset-carbon-black",
            "name": "Carbon Black",
            "colors": {
                "primary": "#FF6B35",
                "secondary": "#2A2A2A",
                "background": "#0D0D0D",
                "background_secondary": "#1A1A1A",
                "text_primary": "#FFFFFF",
                "text_secondary": "rgba(255, 255, 255, 0.85)",
                "text_muted": "rgba(255, 255, 255, 0.6)",
                "button_bg": "#FF6B35",
                "button_text": "#FFFFFF",
                "button_hover_bg": "#FF8555",
                "button_hover_text": "#FFFFFF",
                "border": "rgba(255, 107, 53, 0.2)",
            },
            "fonts": {
                "family": "Inter",
                "h1_size": "66px",
                "h2_size": "48px",
                "h3_size": "32px",
                "body_size": "18px",
                "button_size": "18px",
            },
            "is_active": False,
            "is_preset": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": None,
        },
    }
    
    return themes_map.get(name, themes_map["Industrial Dark"])
