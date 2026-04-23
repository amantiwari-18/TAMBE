from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminLogin(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    message: str


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(credentials: AdminLogin):
    admin_password = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
    
    if credentials.password != admin_password:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    return {
        "token": admin_password,
        "message": "Login successful"
    }


@router.post("/verify")
async def verify_token(token: str):
    admin_password = os.environ.get("ADMIN_PASSWORD", "tambe_admin_2024")
    
    if token != admin_password:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"valid": True, "message": "Token is valid"}
