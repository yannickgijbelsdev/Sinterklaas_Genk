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

# Newsletter Models
class CampaignStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    PAUSED = "paused"

class Subscriber(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    tags: List[str] = []
    subscribed: bool = True
    subscribe_date: datetime = Field(default_factory=datetime.utcnow)
    unsubscribe_date: Optional[datetime] = None
    source: str = "manual"  # manual, csv_import, website
    custom_fields: Dict[str, str] = {}

class SubscriberCreate(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    tags: List[str] = []
    source: str = "manual"
    custom_fields: Dict[str, str] = {}

class MailingList(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    created_date: datetime = Field(default_factory=datetime.utcnow)
    subscriber_count: int = 0
    tags: List[str] = []

class EmailTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    subject: str
    html_content: str
    preview_text: Optional[str] = None
    template_data: Dict = {}  # For drag & drop editor data
    created_date: datetime = Field(default_factory=datetime.utcnow)
    updated_date: datetime = Field(default_factory=datetime.utcnow)

class Campaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    subject: str
    from_name: str
    from_email: str
    reply_to: str
    html_content: str
    preview_text: Optional[str] = None
    status: CampaignStatus = CampaignStatus.DRAFT
    mailing_lists: List[str] = []  # List of mailing list IDs
    tags: List[str] = []  # Target specific tags
    scheduled_date: Optional[datetime] = None
    sent_date: Optional[datetime] = None
    created_date: datetime = Field(default_factory=datetime.utcnow)
    updated_date: datetime = Field(default_factory=datetime.utcnow)
    
    # Analytics
    total_recipients: int = 0
    delivered: int = 0
    opened: int = 0
    clicked: int = 0
    bounced: int = 0
    unsubscribed: int = 0

class CampaignCreate(BaseModel):
    name: str
    subject: str
    from_name: str
    from_email: str
    reply_to: str
    html_content: str
    preview_text: Optional[str] = None
    mailing_lists: List[str] = []
    tags: List[str] = []
    scheduled_date: Optional[datetime] = None

class EmailEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    campaign_id: str
    subscriber_id: str
    event_type: str  # delivered, opened, clicked, bounced, unsubscribed
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict = {}

class CSVImportResult(BaseModel):
    total_rows: int
    successful_imports: int
    failed_imports: int
    errors: List[str]
    created_list_id: Optional[str] = None

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

# Newsletter / Email functions
def get_sendgrid_client():
    """Initialize SendGrid client with API key from environment"""
    api_key = os.environ.get('SENDGRID_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="SendGrid API key not configured")
    return SendGridAPIClient(api_key)

async def send_newsletter_email(to_email: str, subject: str, html_content: str, from_email: str, from_name: str, campaign_id: str = None):
    """Send individual newsletter email via SendGrid"""
    try:
        sg = get_sendgrid_client()
        
        # Add tracking parameters
        tracking_pixel = f'<img src="https://your-domain.com/api/track/open/{campaign_id}/{to_email}" width="1" height="1" style="display:none;" />'
        html_with_tracking = html_content + tracking_pixel
        
        message = Mail(
            from_email=From(from_email, from_name),
            to_emails=To(to_email),
            subject=Subject(subject),
            html_content=HtmlContent(html_with_tracking)
        )
        
        # Enable click tracking
        message.tracking_settings = {
            "click_tracking": {"enable": True},
            "open_tracking": {"enable": True}
        }
        
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        logging.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

async def process_csv_import(csv_content: str, list_name: str) -> CSVImportResult:
    """Process CSV file and import subscribers - Compatible with Mailpoet format"""
    try:
        # Read CSV content
        df = pd.read_csv(StringIO(csv_content))
        
        # Debug: log column names to understand Mailpoet format
        logging.info(f"CSV columns detected: {list(df.columns)}")
        
        total_rows = len(df)
        successful_imports = 0
        failed_imports = 0
        errors = []
        
        # Create new mailing list
        mailing_list = MailingList(
            name=list_name,
            description=f"Imported from CSV on {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
        )
        await db.mailing_lists.insert_one(mailing_list.dict())
        list_id = mailing_list.id
        
        # Mailpoet CSV format compatibility
        # Common Mailpoet columns: Email, First Name, Last Name, Status, Subscribed to lists
        column_mapping = {
            'email': ['email', 'Email', 'EMAIL', 'e-mail', 'E-mail'],
            'first_name': ['first_name', 'First Name', 'FIRST NAME', 'firstname', 'Firstname', 'voornaam', 'Voornaam'],
            'last_name': ['last_name', 'Last Name', 'LAST NAME', 'lastname', 'Lastname', 'achternaam', 'Achternaam'],
            'status': ['status', 'Status', 'STATUS', 'subscribed', 'Subscribed'],
        }
        
        # Find correct column names
        email_col = None
        first_name_col = None
        last_name_col = None
        status_col = None
        
        for col in df.columns:
            if col.strip() in column_mapping['email']:
                email_col = col
            elif col.strip() in column_mapping['first_name']:
                first_name_col = col
            elif col.strip() in column_mapping['last_name']:
                last_name_col = col
            elif col.strip() in column_mapping['status']:
                status_col = col
        
        if not email_col:
            return CSVImportResult(
                total_rows=total_rows,
                successful_imports=0,
                failed_imports=total_rows,
                errors=[f"Geen email kolom gevonden. Gevonden kolommen: {', '.join(df.columns)}"]
            )
        
        # Process each row with batch optimization for large imports
        batch_size = 50  # Process in batches of 50
        batch_subscribers = []
        
        logging.info(f"Processing {total_rows} rows in batches of {batch_size}")
        
        for index, row in df.iterrows():
            try:
                # Extract email (required field)
                email = str(row.get(email_col, '')).strip().lower()
                if not email or pd.isna(email) or email == 'nan' or '@' not in email:
                    errors.append(f"Rij {index + 2}: Ongeldig of ontbrekend email adres")
                    failed_imports += 1
                    continue
                
                # Check status if available (Mailpoet compatibility)
                is_subscribed = True
                if status_col and not pd.isna(row.get(status_col)):
                    status_value = str(row.get(status_col, '')).lower().strip()
                    if status_value in ['unsubscribed', 'unconfirmed', 'inactive', '0', 'false', 'nee', 'no']:
                        is_subscribed = False
                
                # Check if subscriber already exists
                existing = await db.subscribers.find_one({"email": email})
                if existing:
                    # Update existing subscriber if needed
                    await db.subscribers.update_one(
                        {"email": email},
                        {"$addToSet": {"tags": list_name}}
                    )
                    successful_imports += 1
                    continue
                
                # Extract other fields
                first_name = None
                last_name = None
                
                if first_name_col and not pd.isna(row.get(first_name_col)):
                    first_name = str(row.get(first_name_col, '')).strip()
                    if first_name == 'nan' or not first_name:
                        first_name = None
                        
                if last_name_col and not pd.isna(row.get(last_name_col)):
                    last_name = str(row.get(last_name_col, '')).strip()
                    if last_name == 'nan' or not last_name:
                        last_name = None
                
                subscriber_data = {
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "subscribed": is_subscribed,
                    "source": "mailpoet_csv_import",
                    "tags": [list_name],
                    "custom_fields": {}
                }
                
                # Add any additional fields as custom fields (excluding mapped columns)
                mapped_cols = [email_col, first_name_col, last_name_col, status_col]
                for col in df.columns:
                    if col not in mapped_cols and not pd.isna(row.get(col)):
                        value = str(row[col]).strip()
                        if value and value != 'nan':
                            subscriber_data["custom_fields"][col] = value
                
                # Create subscriber
                subscriber = Subscriber(**subscriber_data)
                await db.subscribers.insert_one(subscriber.dict())
                successful_imports += 1
                
            except Exception as e:
                errors.append(f"Rij {index + 2}: {str(e)}")
                failed_imports += 1
                logging.error(f"Error processing row {index + 2}: {str(e)}")
        
        # Update mailing list subscriber count
        await db.mailing_lists.update_one(
            {"id": list_id},
            {"$set": {"subscriber_count": successful_imports}}
        )
        
        logging.info(f"CSV import completed: {successful_imports} success, {failed_imports} failed")
        
        return CSVImportResult(
            total_rows=total_rows,
            successful_imports=successful_imports,
            failed_imports=failed_imports,
            errors=errors[:10],  # Limit to first 10 errors
            created_list_id=list_id
        )
        
    except Exception as e:
        logging.error(f"CSV processing failed: {str(e)}")
        return CSVImportResult(
            total_rows=0,
            successful_imports=0,
            failed_imports=0,
            errors=[f"CSV verwerkingsfout: {str(e)}. Controleer of het bestand een geldige CSV is."]
        )

def create_access_token(data: dict):
    to_encode = data.copy()
    # Extend token lifetime to 7 days for better user experience
    expire = datetime.utcnow() + timedelta(days=7)
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

# Newsletter Management Endpoints
@api_router.get("/admin/newsletter/subscribers", response_model=List[Subscriber])
async def get_all_subscribers(current_user: User = Depends(get_admin_user)):
    """Get all subscribers"""
    subscribers = await db.subscribers.find().to_list(1000)
    return [Subscriber(**subscriber) for subscriber in subscribers]

@api_router.post("/admin/newsletter/subscribers", response_model=Subscriber)
async def create_subscriber(subscriber_data: SubscriberCreate, current_user: User = Depends(get_admin_user)):
    """Create new subscriber"""
    # Check if email already exists
    existing = await db.subscribers.find_one({"email": subscriber_data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    subscriber_dict = subscriber_data.dict()
    subscriber_dict["email"] = subscriber_dict["email"].lower()
    subscriber = Subscriber(**subscriber_dict)
    await db.subscribers.insert_one(subscriber.dict())
    return subscriber

@api_router.delete("/admin/newsletter/subscribers/{subscriber_id}")
async def delete_subscriber(subscriber_id: str, current_user: User = Depends(get_admin_user)):
    """Delete subscriber"""
    result = await db.subscribers.delete_one({"id": subscriber_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return {"message": "Subscriber deleted successfully"}

@api_router.post("/admin/newsletter/import-csv")
async def import_csv(
    file: UploadFile = File(...),
    list_name: str = "Imported List",
    current_user: User = Depends(get_admin_user)
) -> CSVImportResult:
    """Import subscribers from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        contents = await file.read()
        csv_content = contents.decode('utf-8')
        result = await process_csv_import(csv_content, list_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"CSV import failed: {str(e)}")

@api_router.get("/admin/newsletter/lists", response_model=List[MailingList])
async def get_mailing_lists(current_user: User = Depends(get_admin_user)):
    """Get all mailing lists"""
    lists = await db.mailing_lists.find().to_list(1000)
    return [MailingList(**mailing_list) for mailing_list in lists]

@api_router.post("/admin/newsletter/lists", response_model=MailingList)
async def create_mailing_list(name: str, description: str = "", current_user: User = Depends(get_admin_user)):
    """Create new mailing list"""
    mailing_list = MailingList(name=name, description=description)
    await db.mailing_lists.insert_one(mailing_list.dict())
    return mailing_list

@api_router.get("/admin/newsletter/templates", response_model=List[EmailTemplate])
async def get_email_templates(current_user: User = Depends(get_admin_user)):
    """Get all email templates"""
    templates = await db.email_templates.find().to_list(1000)
    return [EmailTemplate(**template) for template in templates]

@api_router.post("/admin/newsletter/templates", response_model=EmailTemplate)
async def create_email_template(
    name: str,
    subject: str,
    html_content: str,
    preview_text: str = "",
    template_data: Dict = {},
    current_user: User = Depends(get_admin_user)
):
    """Create new email template"""
    template = EmailTemplate(
        name=name,
        subject=subject,
        html_content=html_content,
        preview_text=preview_text,
        template_data=template_data
    )
    await db.email_templates.insert_one(template.dict())
    return template

@api_router.put("/admin/newsletter/templates/{template_id}", response_model=EmailTemplate)
async def update_email_template(
    template_id: str,
    name: str = None,
    subject: str = None,
    html_content: str = None,
    preview_text: str = None,
    template_data: Dict = None,
    current_user: User = Depends(get_admin_user)
):
    """Update email template"""
    existing = await db.email_templates.find_one({"id": template_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Template not found")
    
    update_data = {"updated_date": datetime.utcnow()}
    if name is not None:
        update_data["name"] = name
    if subject is not None:
        update_data["subject"] = subject
    if html_content is not None:
        update_data["html_content"] = html_content
    if preview_text is not None:
        update_data["preview_text"] = preview_text
    if template_data is not None:
        update_data["template_data"] = template_data
    
    await db.email_templates.update_one({"id": template_id}, {"$set": update_data})
    updated = await db.email_templates.find_one({"id": template_id})
    return EmailTemplate(**updated)

@api_router.delete("/admin/newsletter/templates/{template_id}")
async def delete_email_template(template_id: str, current_user: User = Depends(get_admin_user)):
    """Delete email template"""
    result = await db.email_templates.delete_one({"id": template_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}

@api_router.get("/admin/newsletter/campaigns", response_model=List[Campaign])
async def get_campaigns(current_user: User = Depends(get_admin_user)):
    """Get all campaigns"""
    campaigns = await db.campaigns.find().sort("created_date", -1).to_list(1000)
    return [Campaign(**campaign) for campaign in campaigns]

@api_router.post("/admin/newsletter/campaigns", response_model=Campaign)
async def create_campaign(campaign_data: CampaignCreate, current_user: User = Depends(get_admin_user)):
    """Create new campaign"""
    campaign = Campaign(**campaign_data.dict())
    await db.campaigns.insert_one(campaign.dict())
    return campaign

@api_router.put("/admin/newsletter/campaigns/{campaign_id}", response_model=Campaign)
async def update_campaign(
    campaign_id: str,
    name: str = None,
    subject: str = None,
    html_content: str = None,
    scheduled_date: datetime = None,
    current_user: User = Depends(get_admin_user)
):
    """Update campaign"""
    existing = await db.campaigns.find_one({"id": campaign_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = {"updated_date": datetime.utcnow()}
    if name is not None:
        update_data["name"] = name
    if subject is not None:
        update_data["subject"] = subject
    if html_content is not None:
        update_data["html_content"] = html_content
    if scheduled_date is not None:
        update_data["scheduled_date"] = scheduled_date
        update_data["status"] = CampaignStatus.SCHEDULED
    
    await db.campaigns.update_one({"id": campaign_id}, {"$set": update_data})
    updated = await db.campaigns.find_one({"id": campaign_id})
    return Campaign(**updated)

@api_router.delete("/admin/newsletter/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, current_user: User = Depends(get_admin_user)):
    """Delete campaign"""
    result = await db.campaigns.delete_one({"id": campaign_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted successfully"}

@api_router.post("/admin/newsletter/campaigns/{campaign_id}/send")
async def send_campaign(campaign_id: str, current_user: User = Depends(get_admin_user)):
    """Send campaign immediately"""
    campaign = await db.campaigns.find_one({"id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    campaign_obj = Campaign(**campaign)
    
    if campaign_obj.status != CampaignStatus.DRAFT and campaign_obj.status != CampaignStatus.SCHEDULED:
        raise HTTPException(status_code=400, detail="Campaign cannot be sent in current status")
    
    # Get subscribers based on mailing lists and tags
    query = {}
    if campaign_obj.mailing_lists or campaign_obj.tags:
        or_conditions = []
        if campaign_obj.tags:
            or_conditions.append({"tags": {"$in": campaign_obj.tags}})
        if campaign_obj.mailing_lists:
            # For simplicity, we'll use list names as tags
            or_conditions.append({"tags": {"$in": campaign_obj.mailing_lists}})
        query["$or"] = or_conditions
        query["subscribed"] = True
    
    subscribers = await db.subscribers.find(query).to_list(10000)
    
    # Update campaign status
    await db.campaigns.update_one(
        {"id": campaign_id},
        {"$set": {
            "status": CampaignStatus.SENDING,
            "total_recipients": len(subscribers),
            "sent_date": datetime.utcnow()
        }}
    )
    
    # Send emails in background
    asyncio.create_task(send_campaign_emails(campaign_obj, subscribers))
    
    return {"message": f"Campaign started! Sending to {len(subscribers)} subscribers"}

@api_router.get("/admin/newsletter/campaigns/{campaign_id}/analytics")
async def get_campaign_analytics(campaign_id: str, current_user: User = Depends(get_admin_user)):
    """Get campaign analytics"""
    campaign = await db.campaigns.find_one({"id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Get events for this campaign
    events = await db.email_events.find({"campaign_id": campaign_id}).to_list(10000)
    
    analytics = {
        "campaign_id": campaign_id,
        "campaign_name": campaign["name"],
        "status": campaign["status"],
        "total_recipients": campaign.get("total_recipients", 0),
        "delivered": len([e for e in events if e["event_type"] == "delivered"]),
        "opened": len([e for e in events if e["event_type"] == "opened"]),
        "clicked": len([e for e in events if e["event_type"] == "clicked"]),
        "bounced": len([e for e in events if e["event_type"] == "bounced"]),
        "unsubscribed": len([e for e in events if e["event_type"] == "unsubscribed"]),
        "open_rate": 0,
        "click_rate": 0
    }
    
    if analytics["delivered"] > 0:
        analytics["open_rate"] = round((analytics["opened"] / analytics["delivered"]) * 100, 2)
        analytics["click_rate"] = round((analytics["clicked"] / analytics["delivered"]) * 100, 2)
    
    return analytics

# Email tracking endpoints
@api_router.get("/track/open/{campaign_id}/{subscriber_email}")
async def track_email_open(campaign_id: str, subscriber_email: str):
    """Track email opens via tracking pixel"""
    try:
        subscriber = await db.subscribers.find_one({"email": subscriber_email})
        if subscriber:
            event = EmailEvent(
                campaign_id=campaign_id,
                subscriber_id=subscriber["id"],
                event_type="opened"
            )
            await db.email_events.insert_one(event.dict())
        
        # Return 1x1 transparent pixel
        from fastapi.responses import Response
        pixel_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\x17IDATx\xda\x62\xf8\x0f\x00\x01\x01\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        return Response(content=pixel_data, media_type="image/png")
    except:
        return Response(content=b'', media_type="image/png")

# Public unsubscribe endpoint
@api_router.get("/unsubscribe/{subscriber_id}")
async def unsubscribe_page(subscriber_id: str):
    """Unsubscribe page"""
    subscriber = await db.subscribers.find_one({"id": subscriber_id})
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    return {"message": "Unsubscribe page", "email": subscriber["email"]}

@api_router.post("/unsubscribe/{subscriber_id}")
async def process_unsubscribe(subscriber_id: str):
    """Process unsubscribe request"""
    result = await db.subscribers.update_one(
        {"id": subscriber_id},
        {"$set": {"subscribed": False, "unsubscribe_date": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    return {"message": "Successfully unsubscribed"}

# Background task for sending campaign emails
async def send_campaign_emails(campaign: Campaign, subscribers: list):
    """Background task to send emails to all subscribers"""
    sent_count = 0
    failed_count = 0
    
    for subscriber in subscribers:
        try:
            success = await send_newsletter_email(
                to_email=subscriber["email"],
                subject=campaign.subject,
                html_content=campaign.html_content,
                from_email=campaign.from_email,
                from_name=campaign.from_name,
                campaign_id=campaign.id
            )
            
            if success:
                # Log delivery event
                event = EmailEvent(
                    campaign_id=campaign.id,
                    subscriber_id=subscriber["id"],
                    event_type="delivered"
                )
                await db.email_events.insert_one(event.dict())
                sent_count += 1
            else:
                failed_count += 1
            
            # Small delay to avoid rate limiting
            await asyncio.sleep(0.1)
            
        except Exception as e:
            logging.error(f"Failed to send email to {subscriber['email']}: {str(e)}")
            failed_count += 1
    
    # Update campaign status
    await db.campaigns.update_one(
        {"id": campaign.id},
        {"$set": {
            "status": CampaignStatus.SENT,
            "delivered": sent_count
        }}
    )
    
    logging.info(f"Campaign {campaign.id} completed: {sent_count} sent, {failed_count} failed")



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
