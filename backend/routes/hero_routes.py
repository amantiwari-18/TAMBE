from fastapi import APIRouter, HTTPException, Depends, Header, File, UploadFile
from fastapi.responses import FileResponse
from typing import List, Optional
from models.hero import (
    HeroSlide,
    HeroSlideCreate,
    HeroSlideUpdate,
    HeroSlideResponse,
)

from datetime import datetime, timezone
import os
import shutil
import uuid
from json_storage import hero_storage

router = APIRouter(prefix="/hero", tags=["hero"])

UPLOAD_DIR = "/app/backend/uploads/hero"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Simple auth check
def verify_admin_token(x_admin_token: Optional[str] = Header(None)):
    admin_password = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
    if x_admin_token != admin_password:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True



# Get all hero slides (public - for website)
@router.get("", response_model=List[HeroSlideResponse])
async def get_hero_slides(
    active_only: bool = True,
    ):
    query = {"is_active": True} if active_only else {}
    slides = hero_storage.find_all(query)
    return [HeroSlide(**slide).dict() for slide in slides]


# Get hero slide by ID
@router.get("/{slide_id}", response_model=HeroSlideResponse)
async def get_hero_slide(slide_id: str, ):
    slide = hero_storage.find_one({"id": slide_id})
    if not slide:
        raise HTTPException(status_code=404, detail="Hero slide not found")
    return HeroSlide(**slide).dict()


# Create new hero slide (admin only)
@router.post("", response_model=HeroSlideResponse)
async def create_hero_slide(
    slide_data: HeroSlideCreate,
    _: bool = Depends(verify_admin_token),
):
    slide = HeroSlide(**slide_data.dict())
    hero_storage.insert_one(slide.dict())
    return slide.dict()


# Update hero slide (admin only)
@router.put("/{slide_id}", response_model=HeroSlideResponse)
async def update_hero_slide(
    slide_id: str,
    slide_data: HeroSlideUpdate,
    _: bool = Depends(verify_admin_token),
):
    slide = hero_storage.find_one({"id": slide_id})
    if not slide:
        raise HTTPException(status_code=404, detail="Hero slide not found")

    update_data = slide_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    hero_storage.update_one({"id": slide_id}, update_data)

    updated_slide = hero_storage.find_one({"id": slide_id})
    return HeroSlide(**updated_slide).dict()


# Delete hero slide (admin only)
@router.delete("/{slide_id}")
async def delete_hero_slide(
    slide_id: str,
    _: bool = Depends(verify_admin_token),
):
    slide = hero_storage.find_one({"id": slide_id})
    if not slide:
        raise HTTPException(status_code=404, detail="Hero slide not found")

    hero_storage.delete_one({"id": slide_id})
    return {"message": "Hero slide deleted successfully"}


# Upload hero image (admin only)
@router.post("/upload-image")
async def upload_hero_image(
    file: UploadFile = File(...),
    _: bool = Depends(verify_admin_token),
):
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return image URL
        image_url = f"/api/hero/images/{unique_filename}"
        return {"image_url": image_url, "message": "Image uploaded successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


# Serve hero images
@router.get("/images/{filename}")
async def get_hero_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)


# Initialize default hero slide
@router.post("/initialize")
async def initialize_hero(
    _: bool = Depends(verify_admin_token),
):
    existing_count = await db.hero_slides.count_documents({})
    if existing_count > 0:
        return {"message": "Hero slides already initialized", "count": existing_count}

    default_slide = HeroSlide(
        title="Engineering Precision. Powering Performance.",
        subtitle="Crafting the future of automotive excellence with precision-engineered components",
        tagline="Where cutting-edge technology meets automotive excellence",
        cta_text="Explore Products",
        cta_link="#products",
        order=0,
    )

    hero_storage.insert_one(default_slide.dict())
    return {"message": "Hero slide initialized successfully"}
