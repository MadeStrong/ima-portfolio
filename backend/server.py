from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'ima-portfolio-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI(title="IMA Portfolio CMS API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =============== MODELS ===============

# Auth Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str = "admin"
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Page Models
class PageCreate(BaseModel):
    title: str
    slug: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: bool = True
    sections: List[Dict[str, Any]] = []

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: Optional[bool] = None
    sections: Optional[List[Dict[str, Any]]] = None

class PageResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    slug: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: bool
    sections: List[Dict[str, Any]]
    created_at: str
    updated_at: str

# Portfolio Models
class PortfolioCreate(BaseModel):
    title: str
    category: str  # graphics, video, social_media, ai_automation
    description: str
    tools_used: List[str] = []
    media_type: Optional[str] = None  # youtube, instagram, tiktok, twitter, image
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    tools_used: Optional[List[str]] = None
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None

class PortfolioResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    category: str
    description: str
    tools_used: List[str]
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: bool
    is_published: bool
    created_at: str
    updated_at: str

# Social Links Models
class SocialLinkCreate(BaseModel):
    platform: str  # linkedin, instagram, facebook, twitter, tiktok, youtube, behance, dribbble, github
    url: str
    is_visible: bool = True
    display_order: int = 0

class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    is_visible: Optional[bool] = None
    display_order: Optional[int] = None

class SocialLinkResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    platform: str
    url: str
    is_visible: bool
    display_order: int

# Content Models
class ContentBlockCreate(BaseModel):
    key: str  # e.g., "hero_title", "hero_subtitle", "about_text"
    value: str
    type: str = "text"  # text, html, image_url

class ContentBlockUpdate(BaseModel):
    value: Optional[str] = None
    type: Optional[str] = None

class ContentBlockResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    key: str
    value: str
    type: str
    updated_at: str

# Navigation Models
class NavItemCreate(BaseModel):
    label: str
    href: str
    display_order: int = 0
    is_visible: bool = True
    is_external: bool = False

class NavItemUpdate(BaseModel):
    label: Optional[str] = None
    href: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None
    is_external: Optional[bool] = None

class NavItemResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    label: str
    href: str
    display_order: int
    is_visible: bool
    is_external: bool

# Message/Lead Models
class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str
    subscribe_newsletter: bool = False

class MessageResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    subscribe_newsletter: bool
    is_read: bool
    created_at: str

# Settings Models
class SettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_color: Optional[str] = None
    footer_text: Optional[str] = None

class SettingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    site_name: str
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_color: str
    footer_text: Optional[str] = None

# =============== AUTH HELPERS ===============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.now(timezone.utc).timestamp() + (24 * 60 * 60)  # 24 hours
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# =============== AUTH ENDPOINTS ===============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({'email': data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        'id': user_id,
        'email': data.email,
        'password': hash_password(data.password),
        'name': data.name,
        'role': 'admin',
        'created_at': now
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, data.email)
    user_response = UserResponse(
        id=user_id,
        email=data.email,
        name=data.name,
        role='admin',
        created_at=now
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({'email': data.email}, {'_id': 0})
    if not user or not verify_password(data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'])
    user_response = UserResponse(
        id=user['id'],
        email=user['email'],
        name=user['name'],
        role=user.get('role', 'admin'),
        created_at=user['created_at']
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user['id'],
        email=user['email'],
        name=user['name'],
        role=user.get('role', 'admin'),
        created_at=user['created_at']
    )

# =============== PAGES ENDPOINTS ===============

@api_router.get("/pages", response_model=List[PageResponse])
async def get_pages(published_only: bool = False):
    query = {'is_published': True} if published_only else {}
    pages = await db.pages.find(query, {'_id': 0}).to_list(100)
    return pages

@api_router.get("/pages/{slug}", response_model=PageResponse)
async def get_page(slug: str):
    page = await db.pages.find_one({'slug': slug}, {'_id': 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@api_router.post("/pages", response_model=PageResponse)
async def create_page(data: PageCreate, user: dict = Depends(get_current_user)):
    existing = await db.pages.find_one({'slug': data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Page with this slug already exists")
    
    page_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    page_doc = {
        'id': page_id,
        **data.model_dump(),
        'created_at': now,
        'updated_at': now
    }
    
    await db.pages.insert_one(page_doc)
    return PageResponse(**{k: v for k, v in page_doc.items() if k != '_id'})

@api_router.put("/pages/{page_id}", response_model=PageResponse)
async def update_page(page_id: str, data: PageUpdate, user: dict = Depends(get_current_user)):
    page = await db.pages.find_one({'id': page_id})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.pages.update_one({'id': page_id}, {'$set': update_data})
    updated = await db.pages.find_one({'id': page_id}, {'_id': 0})
    return PageResponse(**updated)

@api_router.delete("/pages/{page_id}")
async def delete_page(page_id: str, user: dict = Depends(get_current_user)):
    result = await db.pages.delete_one({'id': page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page deleted"}

# =============== PORTFOLIO ENDPOINTS ===============

@api_router.get("/portfolio", response_model=List[PortfolioResponse])
async def get_portfolio(category: Optional[str] = None, featured_only: bool = False, published_only: bool = True):
    query = {}
    if published_only:
        query['is_published'] = True
    if category:
        query['category'] = category
    if featured_only:
        query['is_featured'] = True
    
    items = await db.portfolio.find(query, {'_id': 0}).sort('created_at', -1).to_list(100)
    return items

@api_router.get("/portfolio/{item_id}", response_model=PortfolioResponse)
async def get_portfolio_item(item_id: str):
    item = await db.portfolio.find_one({'id': item_id}, {'_id': 0})
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    return item

@api_router.post("/portfolio", response_model=PortfolioResponse)
async def create_portfolio_item(data: PortfolioCreate, user: dict = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    item_doc = {
        'id': item_id,
        **data.model_dump(),
        'created_at': now,
        'updated_at': now
    }
    
    await db.portfolio.insert_one(item_doc)
    return PortfolioResponse(**{k: v for k, v in item_doc.items() if k != '_id'})

@api_router.put("/portfolio/{item_id}", response_model=PortfolioResponse)
async def update_portfolio_item(item_id: str, data: PortfolioUpdate, user: dict = Depends(get_current_user)):
    item = await db.portfolio.find_one({'id': item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.portfolio.update_one({'id': item_id}, {'$set': update_data})
    updated = await db.portfolio.find_one({'id': item_id}, {'_id': 0})
    return PortfolioResponse(**updated)

@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(item_id: str, user: dict = Depends(get_current_user)):
    result = await db.portfolio.delete_one({'id': item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    return {"message": "Portfolio item deleted"}

# =============== SOCIAL LINKS ENDPOINTS ===============

@api_router.get("/social-links", response_model=List[SocialLinkResponse])
async def get_social_links(visible_only: bool = False):
    query = {'is_visible': True} if visible_only else {}
    links = await db.social_links.find(query, {'_id': 0}).sort('display_order', 1).to_list(20)
    return links

@api_router.post("/social-links", response_model=SocialLinkResponse)
async def create_social_link(data: SocialLinkCreate, user: dict = Depends(get_current_user)):
    link_id = str(uuid.uuid4())
    
    link_doc = {
        'id': link_id,
        **data.model_dump()
    }
    
    await db.social_links.insert_one(link_doc)
    return SocialLinkResponse(**{k: v for k, v in link_doc.items() if k != '_id'})

@api_router.put("/social-links/{link_id}", response_model=SocialLinkResponse)
async def update_social_link(link_id: str, data: SocialLinkUpdate, user: dict = Depends(get_current_user)):
    link = await db.social_links.find_one({'id': link_id})
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    
    await db.social_links.update_one({'id': link_id}, {'$set': update_data})
    updated = await db.social_links.find_one({'id': link_id}, {'_id': 0})
    return SocialLinkResponse(**updated)

@api_router.delete("/social-links/{link_id}")
async def delete_social_link(link_id: str, user: dict = Depends(get_current_user)):
    result = await db.social_links.delete_one({'id': link_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Social link not found")
    return {"message": "Social link deleted"}

# =============== CONTENT ENDPOINTS ===============

@api_router.get("/content", response_model=List[ContentBlockResponse])
async def get_content_blocks():
    blocks = await db.content.find({}, {'_id': 0}).to_list(100)
    return blocks

@api_router.get("/content/{key}", response_model=ContentBlockResponse)
async def get_content_block(key: str):
    block = await db.content.find_one({'key': key}, {'_id': 0})
    if not block:
        raise HTTPException(status_code=404, detail="Content block not found")
    return block

@api_router.post("/content", response_model=ContentBlockResponse)
async def create_content_block(data: ContentBlockCreate, user: dict = Depends(get_current_user)):
    existing = await db.content.find_one({'key': data.key})
    if existing:
        raise HTTPException(status_code=400, detail="Content block with this key already exists")
    
    block_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    block_doc = {
        'id': block_id,
        **data.model_dump(),
        'updated_at': now
    }
    
    await db.content.insert_one(block_doc)
    return ContentBlockResponse(**{k: v for k, v in block_doc.items() if k != '_id'})

@api_router.put("/content/{key}", response_model=ContentBlockResponse)
async def update_content_block(key: str, data: ContentBlockUpdate, user: dict = Depends(get_current_user)):
    block = await db.content.find_one({'key': key})
    if not block:
        raise HTTPException(status_code=404, detail="Content block not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.content.update_one({'key': key}, {'$set': update_data})
    updated = await db.content.find_one({'key': key}, {'_id': 0})
    return ContentBlockResponse(**updated)

# =============== NAVIGATION ENDPOINTS ===============

@api_router.get("/navigation", response_model=List[NavItemResponse])
async def get_nav_items(visible_only: bool = False):
    query = {'is_visible': True} if visible_only else {}
    items = await db.navigation.find(query, {'_id': 0}).sort('display_order', 1).to_list(20)
    return items

@api_router.post("/navigation", response_model=NavItemResponse)
async def create_nav_item(data: NavItemCreate, user: dict = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    
    item_doc = {
        'id': item_id,
        **data.model_dump()
    }
    
    await db.navigation.insert_one(item_doc)
    return NavItemResponse(**{k: v for k, v in item_doc.items() if k != '_id'})

@api_router.put("/navigation/{item_id}", response_model=NavItemResponse)
async def update_nav_item(item_id: str, data: NavItemUpdate, user: dict = Depends(get_current_user)):
    item = await db.navigation.find_one({'id': item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    
    await db.navigation.update_one({'id': item_id}, {'$set': update_data})
    updated = await db.navigation.find_one({'id': item_id}, {'_id': 0})
    return NavItemResponse(**updated)

@api_router.delete("/navigation/{item_id}")
async def delete_nav_item(item_id: str, user: dict = Depends(get_current_user)):
    result = await db.navigation.delete_one({'id': item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    return {"message": "Navigation item deleted"}

# =============== MESSAGES ENDPOINTS ===============

@api_router.get("/messages", response_model=List[MessageResponse])
async def get_messages(user: dict = Depends(get_current_user)):
    messages = await db.messages.find({}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return messages

@api_router.post("/messages", response_model=MessageResponse)
async def create_message(data: MessageCreate):
    message_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    message_doc = {
        'id': message_id,
        **data.model_dump(),
        'is_read': False,
        'created_at': now
    }
    
    await db.messages.insert_one(message_doc)
    
    # Add to leads if subscribed
    if data.subscribe_newsletter:
        existing_lead = await db.leads.find_one({'email': data.email})
        if not existing_lead:
            lead_doc = {
                'id': str(uuid.uuid4()),
                'email': data.email,
                'name': data.name,
                'source': 'contact_form',
                'created_at': now
            }
            await db.leads.insert_one(lead_doc)
    
    return MessageResponse(**{k: v for k, v in message_doc.items() if k != '_id'})

@api_router.put("/messages/{message_id}/read")
async def mark_message_read(message_id: str, user: dict = Depends(get_current_user)):
    result = await db.messages.update_one({'id': message_id}, {'$set': {'is_read': True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message marked as read"}

@api_router.delete("/messages/{message_id}")
async def delete_message(message_id: str, user: dict = Depends(get_current_user)):
    result = await db.messages.delete_one({'id': message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted"}

# =============== LEADS ENDPOINTS ===============

@api_router.get("/leads")
async def get_leads(user: dict = Depends(get_current_user)):
    leads = await db.leads.find({}, {'_id': 0}).sort('created_at', -1).to_list(500)
    return leads

# =============== SETTINGS ENDPOINTS ===============

@api_router.get("/settings", response_model=SettingsResponse)
async def get_settings():
    settings = await db.settings.find_one({}, {'_id': 0})
    if not settings:
        # Return default settings
        return SettingsResponse(
            id='default',
            site_name='IMA',
            logo_url='https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
            favicon_url='https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
            primary_color='#E10600',
            footer_text='© 2025 IMA. All rights reserved.'
        )
    return settings

@api_router.put("/settings", response_model=SettingsResponse)
async def update_settings(data: SettingsUpdate, user: dict = Depends(get_current_user)):
    settings = await db.settings.find_one({})
    
    if not settings:
        # Create default settings first
        settings_doc = {
            'id': 'default',
            'site_name': 'IMA',
            'logo_url': 'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
            'favicon_url': 'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
            'primary_color': '#E10600',
            'footer_text': '© 2025 IMA. All rights reserved.'
        }
        await db.settings.insert_one(settings_doc)
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    
    await db.settings.update_one({}, {'$set': update_data})
    updated = await db.settings.find_one({}, {'_id': 0})
    return SettingsResponse(**updated)

# =============== STATS ENDPOINTS ===============

@api_router.get("/stats")
async def get_stats(user: dict = Depends(get_current_user)):
    portfolio_count = await db.portfolio.count_documents({})
    pages_count = await db.pages.count_documents({})
    messages_count = await db.messages.count_documents({})
    unread_messages = await db.messages.count_documents({'is_read': False})
    leads_count = await db.leads.count_documents({})
    
    return {
        'portfolio_items': portfolio_count,
        'pages': pages_count,
        'messages': messages_count,
        'unread_messages': unread_messages,
        'leads': leads_count
    }

# =============== SEED DATA ENDPOINT ===============

@api_router.post("/seed")
async def seed_data():
    """Seed initial sample data for demonstration"""
    now = datetime.now(timezone.utc).isoformat()
    
    # Check if already seeded
    existing = await db.content.find_one({'key': 'hero_title'})
    if existing:
        return {"message": "Data already seeded"}
    
    # Seed content blocks
    content_blocks = [
        {'id': str(uuid.uuid4()), 'key': 'hero_title', 'value': 'Creative Solutions for the Digital Age', 'type': 'text', 'updated_at': now},
        {'id': str(uuid.uuid4()), 'key': 'hero_subtitle', 'value': 'Graphic Design • Video Editing • Social Media • AI Automation', 'type': 'text', 'updated_at': now},
        {'id': str(uuid.uuid4()), 'key': 'hero_cta', 'value': 'View Our Work', 'type': 'text', 'updated_at': now},
        {'id': str(uuid.uuid4()), 'key': 'about_title', 'value': 'About IMA', 'type': 'text', 'updated_at': now},
        {'id': str(uuid.uuid4()), 'key': 'about_text', 'value': 'We are a creative studio specializing in visual storytelling, brand development, and cutting-edge digital solutions. Our mission is to transform ideas into impactful experiences that resonate with audiences and drive results.', 'type': 'text', 'updated_at': now},
        {'id': str(uuid.uuid4()), 'key': 'services_title', 'value': 'What We Do', 'type': 'text', 'updated_at': now},
        {'id': str(uuid.uuid4()), 'key': 'contact_title', 'value': "Let's Create Together", 'type': 'text', 'updated_at': now},
        {'id': str(uuid.uuid4()), 'key': 'contact_subtitle', 'value': 'Have a project in mind? We would love to hear from you.', 'type': 'text', 'updated_at': now},
    ]
    await db.content.insert_many(content_blocks)
    
    # Seed navigation
    nav_items = [
        {'id': str(uuid.uuid4()), 'label': 'Home', 'href': '/', 'display_order': 0, 'is_visible': True, 'is_external': False},
        {'id': str(uuid.uuid4()), 'label': 'Portfolio', 'href': '/portfolio', 'display_order': 1, 'is_visible': True, 'is_external': False},
        {'id': str(uuid.uuid4()), 'label': 'Services', 'href': '/services', 'display_order': 2, 'is_visible': True, 'is_external': False},
        {'id': str(uuid.uuid4()), 'label': 'About', 'href': '/about', 'display_order': 3, 'is_visible': True, 'is_external': False},
        {'id': str(uuid.uuid4()), 'label': 'Contact', 'href': '/contact', 'display_order': 4, 'is_visible': True, 'is_external': False},
    ]
    await db.navigation.insert_many(nav_items)
    
    # Seed social links
    social_links = [
        {'id': str(uuid.uuid4()), 'platform': 'instagram', 'url': 'https://instagram.com/ima', 'is_visible': True, 'display_order': 0},
        {'id': str(uuid.uuid4()), 'platform': 'linkedin', 'url': 'https://linkedin.com/company/ima', 'is_visible': True, 'display_order': 1},
        {'id': str(uuid.uuid4()), 'platform': 'behance', 'url': 'https://behance.net/ima', 'is_visible': True, 'display_order': 2},
        {'id': str(uuid.uuid4()), 'platform': 'youtube', 'url': 'https://youtube.com/@ima', 'is_visible': True, 'display_order': 3},
    ]
    await db.social_links.insert_many(social_links)
    
    # Seed portfolio items
    portfolio_items = [
        {
            'id': str(uuid.uuid4()),
            'title': 'Brand Identity Design',
            'category': 'graphics',
            'description': 'Complete brand identity package including logo, color palette, typography, and brand guidelines.',
            'tools_used': ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
            'media_type': 'image',
            'media_url': None,
            'thumbnail_url': 'https://images.unsplash.com/photo-1600590008363-1c7dcf5d568d?w=800',
            'is_featured': True,
            'is_published': True,
            'created_at': now,
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()),
            'title': 'Product Launch Video',
            'category': 'video',
            'description': 'Cinematic product launch video with motion graphics and professional color grading.',
            'tools_used': ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'],
            'media_type': 'youtube',
            'media_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'thumbnail_url': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
            'is_featured': True,
            'is_published': True,
            'created_at': now,
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()),
            'title': 'Social Media Campaign',
            'category': 'social_media',
            'description': 'Comprehensive social media strategy and content creation for product launch.',
            'tools_used': ['Canva', 'Adobe Express', 'Hootsuite'],
            'media_type': 'image',
            'media_url': None,
            'thumbnail_url': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
            'is_featured': False,
            'is_published': True,
            'created_at': now,
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()),
            'title': 'AI Workflow Automation',
            'category': 'ai_automation',
            'description': 'Custom AI-powered automation system for content scheduling and analytics.',
            'tools_used': ['Python', 'OpenAI API', 'Zapier', 'Make'],
            'media_type': 'image',
            'media_url': None,
            'thumbnail_url': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
            'is_featured': True,
            'is_published': True,
            'created_at': now,
            'updated_at': now
        },
    ]
    await db.portfolio.insert_many(portfolio_items)
    
    # Seed settings
    settings = {
        'id': 'default',
        'site_name': 'IMA',
        'logo_url': 'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
        'favicon_url': 'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
        'primary_color': '#E10600',
        'footer_text': '© 2025 IMA. All rights reserved.'
    }
    await db.settings.insert_one(settings)
    
    return {"message": "Sample data seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
