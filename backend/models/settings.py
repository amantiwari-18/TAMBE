from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # WhatsApp Settings
    whatsapp_number: str = "+1234567890"
    whatsapp_message: str = "Hello! I'm interested in your products."
    
    # Hero Section
    hero_title: str = "Engineering Precision. Powering Performance."
    hero_subtitle: str = "Crafting the future of automotive excellence with precision-engineered components"
    hero_tagline: str = "Where cutting-edge technology meets automotive excellence"
    
    # About Section
    about_title: str = "Redefining Automotive Excellence"
    about_description: str = "Tambe stands at the forefront of precision engineering, delivering world-class vehicle gears and mechanical components."
    
    # Contact Info
    contact_email: str = "info@tambe.engineering"
    contact_phone: str = "+1 (555) 123-4567"
    contact_address: str = "Industrial Estate, Precision Park, Automotive Hub"
    contact_hours: str = "Mon - Sat: 9:00 AM - 6:00 PM"
    
    # Footer
    footer_tagline: str = "Engineering Excellence Since 1999"
    
    # Social Links
    linkedin_url: Optional[str] = "#"
    twitter_url: Optional[str] = "#"
    instagram_url: Optional[str] = "#"
    facebook_url: Optional[str] = "#"
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SiteSettingsUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    whatsapp_message: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_tagline: Optional[str] = None
    about_title: Optional[str] = None
    about_description: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    contact_hours: Optional[str] = None
    footer_tagline: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None


class SiteSettingsResponse(BaseModel):
    id: str
    whatsapp_number: str
    whatsapp_message: str
    hero_title: str
    hero_subtitle: str
    hero_tagline: str
    about_title: str
    about_description: str
    contact_email: str
    contact_phone: str
    contact_address: str
    contact_hours: str
    footer_tagline: str
    linkedin_url: Optional[str]
    twitter_url: Optional[str]
    instagram_url: Optional[str]
    facebook_url: Optional[str]
    updated_at: datetime
