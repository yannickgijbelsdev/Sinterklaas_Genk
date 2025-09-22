#!/usr/bin/env python3
"""
Seed database with initial data for the Sinterklaas Show website
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'sinterklaas_show')

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🎭 Seeding Sinterklaas Show database...")
    
    # Clear existing data
    await db.news.delete_many({})
    await db.shows.delete_many({})
    await db.content.delete_many({})
    await db.gallery.delete_many({})
    
    # Seed News Articles
    news_articles = [
        {
            "id": str(uuid.uuid4()),
            "title": "Extra voorstellingen toegevoegd!",
            "excerpt": "Door de grote belangstelling hebben we extra voorstellingen toegevoegd in Amsterdam en Rotterdam.",
            "content": "Vanwege de overweldigende reacties op onze Sinterklaas show hebben we besloten om extra voorstellingen toe te voegen in Amsterdam en Rotterdam. Deze nieuwe data zijn nu beschikbaar voor boeken.",
            "image": "https://images.unsplash.com/photo-1594127144873-74df70c557c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNob3d8ZW58MHx8fHwxNzU4NTY5OTA3fDA&ixlib=rb-4.1.0&q=85",
            "date": "2024-11-10",
            "published": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Sinterklaas is aangekomen!",
            "excerpt": "Sinterklaas is aangekomen in Nederland en bereidt zich voor op de show van dit jaar.",
            "content": "Met veel pracht en praal is Sinterklaas weer aangekomen in Nederland. Dit jaar heeft hij een hele bijzondere show voorbereid met nieuwe liedjes en verrassingen.",
            "image": "https://images.pexels.com/photos/6021574/pexels-photo-6021574.jpeg",
            "date": "2024-11-01",
            "published": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Nieuwe liedjes in de show",
            "excerpt": "Dit jaar introduceren we drie compleet nieuwe Sinterklaasliedjes in onze show.",
            "content": "Onze componisten hebben hard gewerkt aan drie prachtige nieuwe liedjes die kinderen zeker zullen leren kennen en meezingen tijdens de voorstelling.",
            "image": "https://images.unsplash.com/photo-1594127141105-37bdc7ef4d3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxjb2xvcmZ1bCUyMHNob3d8ZW58MHx8fHwxNzU4NTY5OTA3fDA&ixlib=rb-4.1.0&q=85",
            "date": "2024-10-25",
            "published": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    await db.news.insert_many(news_articles)
    print(f"✅ Seeded {len(news_articles)} news articles")
    
    # Seed Show Dates
    show_dates = [
        {
            "id": str(uuid.uuid4()),
            "date": "2024-12-15",
            "time": "14:00",
            "venue": "Theater De Flint",
            "city": "Amersfoort",
            "ticketsAvailable": True,
            "ticketUrl": "https://external-ticket-provider.com/sinterklaas-show-1",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "date": "2024-12-16",
            "time": "11:00",
            "venue": "Stadsschouwburg",
            "city": "Utrecht",
            "ticketsAvailable": True,
            "ticketUrl": "https://external-ticket-provider.com/sinterklaas-show-2",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "date": "2024-12-17",
            "time": "15:30",
            "venue": "Concertgebouw",
            "city": "Amsterdam",
            "ticketsAvailable": False,
            "ticketUrl": "https://external-ticket-provider.com/sinterklaas-show-3",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "date": "2024-12-21",
            "time": "13:00",
            "venue": "Theater Orpheus",
            "city": "Apeldoorn",
            "ticketsAvailable": True,
            "ticketUrl": "https://external-ticket-provider.com/sinterklaas-show-4",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    await db.shows.insert_many(show_dates)
    print(f"✅ Seeded {len(show_dates)} show dates")
    
    # Seed Content
    content_items = [
        {
            "id": str(uuid.uuid4()),
            "section": "hero",
            "type": "text",
            "key": "title",
            "value": "De Magische Sinterklaas Show",
            "updatedAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "section": "hero",
            "type": "text",
            "key": "subtitle",
            "value": "Een onvergetelijke ervaring voor het hele gezin",
            "updatedAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "section": "hero",
            "type": "image",
            "key": "background_image",
            "value": "https://images.unsplash.com/photo-1665844190962-13faad0e8d8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxzaW50ZXJrbGFhc3xlbnwwfHx8fDE3NTg1Njk5MDF8MA&ixlib=rb-4.1.0&q=85",
            "updatedAt": datetime.utcnow()
        }
    ]
    
    await db.content.insert_many(content_items)
    print(f"✅ Seeded {len(content_items)} content items")
    
    # Seed Gallery
    gallery_items = [
        {
            "id": str(uuid.uuid4()),
            "image": "https://images.unsplash.com/photo-1665844190962-13faad0e8d8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxzaW50ZXJrbGFhc3xlbnwwfHx8fDE3NTg1Njk5MDF8MA&ixlib=rb-4.1.0&q=85",
            "title": "Sinterklaaslekkers",
            "description": "Heerlijke pepernoten en chocoladeletters",
            "createdAt": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "image": "https://images.pexels.com/photos/6021574/pexels-photo-6021574.jpeg",
            "title": "Sinterklaas arriveert",
            "description": "De goedheiligman komt aan in de stad",
            "createdAt": datetime.utcnow()
        }
    ]
    
    await db.gallery.insert_many(gallery_items)
    print(f"✅ Seeded {len(gallery_items)} gallery items")
    
    client.close()
    print("🎉 Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_database())