from fastapi import APIRouter, HTTPException, Depends, Header, File, UploadFile
from fastapi.responses import FileResponse
from typing import List, Optional
from models.product import (
    Product,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)

from datetime import datetime, timezone
import os
import shutil
import uuid
from json_storage import products_storage

router = APIRouter(prefix="/products", tags=["products"])

UPLOAD_DIR = "/app/backend/uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Simple auth check
def verify_admin_token(x_admin_token: Optional[str] = Header(None)):
    admin_password = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
    if x_admin_token != admin_password:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True



# Get all products (public - for website)
@router.get("", response_model=List[ProductResponse])
async def get_products(
    active_only: bool = True,
    ):
    query = {"is_active": True} if active_only else {}
    products = products_storage.find_all(query)
    return [Product(**product).dict() for product in products]


# Get product by ID
@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, ):
    product = products_storage.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product).dict()


# Create new product (admin only)
@router.post("", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    _: bool = Depends(verify_admin_token),
):
    product = Product(**product_data.dict())
    products_storage.insert_one(product.dict())
    return product.dict()


# Update product (admin only)
@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    _: bool = Depends(verify_admin_token),
):
    product = products_storage.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.products.update_one({"id": product_id}, {"$set": update_data})

    updated_product = products_storage.find_one({"id": product_id})
    return Product(**updated_product).dict()


# Delete product (admin only)
@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    _: bool = Depends(verify_admin_token),
):
    product = products_storage.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    products_storage.delete_one({"id": product_id})
    return {"message": "Product deleted successfully"}


# Upload product image (admin only)
@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    _: bool = Depends(verify_admin_token),
):
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.")
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return image URL
        image_url = f"/api/products/images/{unique_filename}"
        return {"image_url": image_url, "message": "Image uploaded successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


# Serve product images
@router.get("/images/{filename}")
async def get_product_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)


# Reorder products (admin only)
@router.post("/reorder")
async def reorder_products(
    product_ids: List[str],
    _: bool = Depends(verify_admin_token),
):
    for index, product_id in enumerate(product_ids):
        await db.products.update_one(
            {"id": product_id},
            {"$set": {"order": index, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"message": "Products reordered successfully"}


# Initialize default products
@router.post("/initialize")
async def initialize_products(
    _: bool = Depends(verify_admin_token),
):
    # Check if products already exist
    existing_count = await db.products.count_documents({})
    if existing_count > 0:
        return {"message": "Products already initialized", "count": existing_count}

    default_products = [
        {
            "name": "Precision Gears",
            "category": "Gears",
            "description": "High-performance gears engineered for maximum durability and efficiency",
            "features": ["CNC Machined", "Heat Treated", "ISO Certified"],
            "order": 0,
        },
        {
            "name": "Transmission Systems",
            "category": "Automotive Parts",
            "description": "Complete transmission solutions for modern vehicles",
            "features": ["Advanced Design", "Tested Durability", "Custom Fit"],
            "order": 1,
        },
        {
            "name": "Custom Components",
            "category": "Custom Components",
            "description": "Bespoke mechanical parts tailored to your specifications",
            "features": ["Made to Order", "Precision Crafted", "Quality Assured"],
            "order": 2,
        },
        {
            "name": "Drive Shafts",
            "category": "Automotive Parts",
            "description": "Premium drive shafts built for performance and longevity",
            "features": ["Balanced Design", "Stress Tested", "Premium Materials"],
            "order": 3,
        },
        {
            "name": "Differential Gears",
            "category": "Gears",
            "description": "Specialized differential gears for enhanced vehicle control",
            "features": ["Precision Cut", "Low Noise", "High Torque"],
            "order": 4,
        },
        {
            "name": "Clutch Systems",
            "category": "Automotive Parts",
            "description": "Reliable clutch systems for smooth power transfer",
            "features": ["Smooth Engagement", "Long Lasting", "Performance Grade"],
            "order": 5,
        },
    ]

    products = []
    for prod_data in default_products:
        product = Product(**prod_data)
        products.append(product.dict())

    await db.products.insert_many(products)
    return {"message": "Products initialized successfully", "count": len(products)}
