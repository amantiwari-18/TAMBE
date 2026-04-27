from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    description: str
    features: List[str]
    image_url: Optional[str] = None
    link_url: Optional[str] = None  # Learn More button URL
    is_active: bool = True
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: Optional[str] = None


class ProductCreate(BaseModel):
    name: str
    category: str
    description: str
    features: List[str]
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    is_active: bool = True
    order: int = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    features: List[str]
    image_url: Optional[str]
    link_url: Optional[str]
    is_active: bool
    order: int
    created_at: str
    updated_at: Optional[str] = None
