from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class HeroSlide(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str
    tagline: str
    cta_text: str = "Explore Products"
    cta_link: str = "#products"
    image_url: Optional[str] = None
    is_active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class HeroSlideCreate(BaseModel):
    title: str
    subtitle: str
    tagline: str
    cta_text: str = "Explore Products"
    cta_link: str = "#products"
    image_url: Optional[str] = None
    is_active: bool = True
    order: int = 0


class HeroSlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    tagline: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class HeroSlideResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    tagline: str
    cta_text: str
    cta_link: str
    image_url: Optional[str]
    is_active: bool
    order: int
    created_at: datetime
    updated_at: datetime
