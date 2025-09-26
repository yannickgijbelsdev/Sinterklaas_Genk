from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Depends, status
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import pandas as pd
from io import StringIO
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, To, Subject, HtmlContent
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
import shutil
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import json
import asyncio
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
JWT_SECRET = os.environ.get('JWT_SECRET', 'sinterklaas-show-secret-key-2024')
JWT_ALGORITHM = 'HS256'
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Admin Models
class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    image: str
    date: str
    published: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class NewsArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image: str
    date: str
    published: bool = True

class NewsArticleUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    date: Optional[str] = None
    published: Optional[bool] = None

class ShowDate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    time: str
    venue: str
    city: str
    ticketsAvailable: bool = True
    ticketUrl: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ShowDateCreate(BaseModel):
    date: str
    time: str
    venue: str
    city: str
    ticketsAvailable: bool = True
    ticketUrl: str

class ShowDateUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    venue: Optional[str] = None
    city: Optional[str] = None
    ticketsAvailable: Optional[bool] = None
    ticketUrl: Optional[str] = None

class ContentItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    section: str
    type: str  # 'text', 'image', 'color', 'settings'
    key: str
    value: str
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ContentUpdate(BaseModel):
    section: str
    type: str
    key: str
    value: str

class GalleryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image: str
    title: str
    description: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Authentication Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    hashed_password: str
    is_active: bool = True
    is_admin: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    is_admin: bool = False

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[dict] = None

class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    logo: str
    favicon: str
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Create uploads directory
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

# Authentication functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"username": username})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Authentication Routes
@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    try:
        user = await db.users.find_one({"username": user_data.username})
        
        if not user or not verify_password(user_data.password, user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not user["is_active"]:
            raise HTTPException(status_code=401, detail="Account deactivated")
        
        token = create_access_token({"sub": user["username"]})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "is_admin": user["is_admin"],
                "is_active": user["is_active"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/auth/verify")
async def verify_token(current_user: User = Depends(get_current_user)):
    user_dict = {k: v for k, v in current_user.dict().items() if k != "hashed_password"}
    return {"valid": True, "user": user_dict}

@api_router.post("/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Public Routes - News (No authentication required)
@api_router.get("/news", response_model=List[NewsArticle])
async def get_published_news():
    """Get all published news articles for public viewing"""
    news_items = await db.news.find({"published": True}).sort("createdAt", -1).to_list(1000)
    return [NewsArticle(**item) for item in news_items]

# Admin Routes - News Management (Protected)
@api_router.get("/admin/news", response_model=List[NewsArticle])
async def get_all_news(current_user: User = Depends(get_admin_user)):
    news_items = await db.news.find().to_list(1000)
    return [NewsArticle(**item) for item in news_items]

@api_router.post("/admin/news", response_model=NewsArticle)
async def create_news_article(article: NewsArticleCreate, current_user: User = Depends(get_admin_user)):
    article_dict = article.dict()
    article_obj = NewsArticle(**article_dict)
    await db.news.insert_one(article_obj.dict())
    return article_obj

@api_router.put("/admin/news/{article_id}", response_model=NewsArticle)
async def update_news_article(article_id: str, update_data: NewsArticleUpdate, current_user: User = Depends(get_admin_user)):
    existing_article = await db.news.find_one({"id": article_id})
    if not existing_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updatedAt"] = datetime.utcnow()
    
    await db.news.update_one({"id": article_id}, {"$set": update_dict})
    
    updated_article = await db.news.find_one({"id": article_id})
    return NewsArticle(**updated_article)

@api_router.delete("/admin/news/{article_id}")
async def delete_news_article(article_id: str, current_user: User = Depends(get_admin_user)):
    result = await db.news.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}

# Admin Routes - Show Management
@api_router.get("/admin/shows", response_model=List[ShowDate])
async def get_all_shows():
    shows = await db.shows.find().to_list(1000)
    return [ShowDate(**show) for show in shows]

@api_router.post("/admin/shows", response_model=ShowDate)
async def create_show_date(show: ShowDateCreate):
    show_dict = show.dict()
    show_obj = ShowDate(**show_dict)
    await db.shows.insert_one(show_obj.dict())
    return show_obj

@api_router.put("/admin/shows/{show_id}", response_model=ShowDate)
async def update_show_date(show_id: str, update_data: ShowDateUpdate):
    existing_show = await db.shows.find_one({"id": show_id})
    if not existing_show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updatedAt"] = datetime.utcnow()
    
    await db.shows.update_one({"id": show_id}, {"$set": update_dict})
    
    updated_show = await db.shows.find_one({"id": show_id})
    return ShowDate(**updated_show)

@api_router.delete("/admin/shows/{show_id}")
async def delete_show_date(show_id: str):
    result = await db.shows.delete_one({"id": show_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Show not found")
    return {"message": "Show deleted successfully"}

# Admin Routes - Content Management (Protected)
@api_router.get("/admin/content")
async def get_all_content(current_user: User = Depends(get_admin_user)):
    content_items = await db.content.find().to_list(1000)
    return [ContentItem(**item) for item in content_items]

@api_router.put("/admin/content")
async def update_content(content_updates: List[ContentUpdate], current_user: User = Depends(get_admin_user)):
    for update in content_updates:
        # Check if content item exists
        existing = await db.content.find_one({
            "section": update.section,
            "key": update.key
        })
        
        if existing:
            # Update existing
            await db.content.update_one(
                {"section": update.section, "key": update.key},
                {"$set": {
                    "value": update.value,
                    "updatedAt": datetime.utcnow()
                }}
            )
        else:
            # Create new
            content_item = ContentItem(**update.dict())
            await db.content.insert_one(content_item.dict())
    
    return {"message": "Content updated successfully"}

# File Upload (Protected)
@api_router.post("/admin/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_admin_user)):
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = uploads_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    return {"url": f"/uploads/{unique_filename}", "filename": unique_filename}

# Gallery Management
@api_router.get("/admin/gallery", response_model=List[GalleryItem])
async def get_gallery():
    gallery_items = await db.gallery.find().to_list(1000)
    return [GalleryItem(**item) for item in gallery_items]

@api_router.post("/admin/gallery", response_model=GalleryItem)
async def add_gallery_item(item: GalleryItem):
    await db.gallery.insert_one(item.dict())
    return item

# User Management (Super Admin only)
@api_router.get("/admin/users", response_model=List[dict])
async def get_all_users(current_user: User = Depends(get_admin_user)):
    users = await db.users.find().to_list(1000)
    # Remove password hashes from response
    return [{k: v for k, v in user.items() if k != "hashed_password"} for user in users]

@api_router.post("/admin/users", response_model=dict)
async def create_user(user_data: UserCreate, current_user: User = Depends(get_admin_user)):
    # Check if username already exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user_dict = user_data.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    
    user_obj = User(**user_dict)
    await db.users.insert_one(user_obj.dict())
    
    # Return user without password
    result = user_obj.dict()
    result.pop("hashed_password")
    return result

@api_router.put("/admin/users/{user_id}")
async def update_user(user_id: str, update_data: UserUpdate, current_user: User = Depends(get_admin_user)):
    existing_user = await db.users.find_one({"id": user_id})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    # Hash password if provided
    if "password" in update_dict:
        update_dict["hashed_password"] = hash_password(update_dict.pop("password"))
    
    update_dict["updatedAt"] = datetime.utcnow()
    
    await db.users.update_one({"id": user_id}, {"$set": update_dict})
    return {"message": "User updated successfully"}

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, current_user: User = Depends(get_admin_user)):
    # Prevent self-deletion
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# Site Settings Management
@api_router.get("/admin/settings")
async def get_site_settings(current_user: User = Depends(get_admin_user)):
    settings = await db.site_settings.find_one() or {"logo": "", "favicon": ""}
    return settings

@api_router.put("/admin/settings")
async def update_site_settings(logo: str = "", favicon: str = "", current_user: User = Depends(get_admin_user)):
    settings_data = {
        "logo": logo,
        "favicon": favicon,
        "updatedAt": datetime.utcnow()
    }
    
    await db.site_settings.update_one(
        {},
        {"$set": settings_data},
        upsert=True
    )
    
    return {"message": "Settings updated successfully"}



# Include the router in the main app
app.include_router(api_router)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
