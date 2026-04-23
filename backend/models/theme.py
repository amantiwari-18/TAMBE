from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class FontSettings(BaseModel):
    family: str = "Inter"
    h1_size: str = "66px"
    h2_size: str = "48px"
    h3_size: str = "32px"
    body_size: str = "18px"
    button_size: str = "18px"


class ColorSettings(BaseModel):
    primary: str = "#00FFD1"
    secondary: str = "#FFFFFF"
    background: str = "#000000"
    background_secondary: str = "#121212"
    text_primary: str = "#FFFFFF"
    text_secondary: str = "rgba(255, 255, 255, 0.8)"
    text_muted: str = "rgba(255, 255, 255, 0.6)"
    button_bg: str = "#00FFD1"
    button_text: str = "#000000"
    button_hover_bg: str = "#FFFFFF"
    button_hover_text: str = "#000000"
    border: str = "rgba(255, 255, 255, 0.1)"


class Theme(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    colors: ColorSettings
    fonts: FontSettings
    is_active: bool = False
    is_preset: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ThemeCreate(BaseModel):
    name: str
    colors: ColorSettings
    fonts: FontSettings


class ThemeUpdate(BaseModel):
    name: Optional[str] = None
    colors: Optional[ColorSettings] = None
    fonts: Optional[FontSettings] = None


class ThemeResponse(BaseModel):
    id: str
    name: str
    colors: ColorSettings
    fonts: FontSettings
    is_active: bool
    is_preset: bool
    created_at: datetime
    updated_at: datetime
