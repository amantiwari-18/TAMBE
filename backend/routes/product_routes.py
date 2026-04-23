from fastapi import APIRouter, HTTPException, Depends, Header
from typing import List, Optional
from models.product import (
    Product,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import os

router = APIRouter(prefix="/products", tags=["products"])


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


# Get all products (public - for website)
@router.get("", response_model=List[ProductResponse])
async def get_products(
    active_only: bool = True,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    query = {"is_active": True} if active_only else {}
    products = await db.products.find(query).sort("order", 1).to_list(100)
    return [Product(**product).dict() for product in products]


# Get product by ID
@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product).dict()


# Create new product (admin only)
@router.post("", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    product = Product(**product_data.dict())
    await db.products.insert_one(product.dict())
    return product.dict()


# Update product (admin only)
@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()

    await db.products.update_one({"id": product_id}, {"$set": update_data})

    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product).dict()


# Delete product (admin only)
@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.products.delete_one({"id": product_id})
    return {"message": "Product deleted successfully"}


# Reorder products (admin only)
@router.post("/reorder")
async def reorder_products(
    product_ids: List[str],
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    for index, product_id in enumerate(product_ids):
        await db.products.update_one(
            {"id": product_id},
            {"$set": {"order": index, "updated_at": datetime.utcnow()}}
        )
    return {"message": "Products reordered successfully"}


# Initialize default products
@router.post("/initialize")
async def initialize_products(
    db: AsyncIOMotorDatabase = Depends(get_db),
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
