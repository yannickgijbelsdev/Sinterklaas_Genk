#!/usr/bin/env python3
"""
Create initial admin user for Sinterklaas Show website
"""
import asyncio
import os
import uuid
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'sinterklaas_show')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def create_admin_user():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin user already exists
    existing_admin = await db.users.find_one({"is_admin": True})
    if existing_admin:
        print(f"✅ Admin user already exists: {existing_admin['username']}")
        client.close()
        return existing_admin['username']
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "username": "admin",
        "email": "admin@sinterklaasshow.nl",
        "hashed_password": hash_password("KYLovie13monx"),  # Admin password changed
        "is_active": True,
        "is_admin": True,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.users.insert_one(admin_user)
    print("🔐 Admin user created successfully!")
    print("📋 Login credentials:")
    print("   Username: admin")
    print("   Password: KYLovie13monx")
    print("   ⚠️  IMPORTANT: Change this password after first login!")
    
    client.close()
    return "admin"

if __name__ == "__main__":
    asyncio.run(create_admin_user())