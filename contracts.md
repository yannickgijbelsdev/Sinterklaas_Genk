# Sinterklaas Website Admin Panel - API Contracts

## Overview
Complete admin panel voor het bewerken van de Sinterklaas website content zonder code kennis. Webbuilder functionaliteit voor content management.

## Backend API Endpoints

### News Management
- `GET /api/admin/news` - Get all news articles
- `POST /api/admin/news` - Create new news article
- `PUT /api/admin/news/:id` - Update news article
- `DELETE /api/admin/news/:id` - Delete news article

### Show Management
- `GET /api/admin/shows` - Get all shows
- `POST /api/admin/shows` - Create new show
- `PUT /api/admin/shows/:id` - Update show details
- `DELETE /api/admin/shows/:id` - Delete show

### Content Management
- `GET /api/admin/content` - Get all editable content (hero banners, text, images)
- `PUT /api/admin/content` - Update website content
- `POST /api/admin/upload` - Upload images for banners/gallery

### Gallery Management
- `GET /api/admin/gallery` - Get all gallery images
- `POST /api/admin/gallery` - Add new gallery image
- `DELETE /api/admin/gallery/:id` - Remove gallery image

### Characters Management
- `GET /api/admin/characters` - Get all characters
- `PUT /api/admin/characters/:id` - Update character info

## Frontend Admin Features

### Dashboard
- Overview van website statistieken
- Quick access naar verschillende secties
- Recent changes log

### News Editor
- Rich text editor voor artikelen
- Image upload voor artikel headers
- Preview functionaliteit
- Publish/draft status

### Content Editor (Webbuilder)
- Drag & drop interface voor secties
- Visual editing van text content
- Image replacement tool
- Color scheme picker
- Font selector

### Banner Manager
- Upload nieuwe banner afbeeldingen
- Crop/resize tool
- Preview hoe banners eruit zien
- Backup van oude banners

### Show Manager
- Add/edit show dates en venues
- Ticket URL management
- Availability status toggle

## Data Models

### News
```javascript
{
  id: string,
  title: string,
  excerpt: string,
  content: string,
  image: string,
  date: string,
  published: boolean,
  createdAt: date,
  updatedAt: date
}
```

### Content
```javascript
{
  id: string,
  section: string, // 'hero', 'about', 'characters', etc.
  type: string,    // 'text', 'image', 'color', 'settings'
  key: string,     // 'title', 'subtitle', 'background_image'
  value: string,   // actual content
  updatedAt: date
}
```

### Shows
```javascript
{
  id: string,
  date: string,
  time: string,
  venue: string,
  city: string,
  ticketsAvailable: boolean,
  ticketUrl: string,
  createdAt: date,
  updatedAt: date
}
```

## Integration Plan

1. **Phase 1**: Create admin API endpoints and basic admin panel
2. **Phase 2**: Add visual content editor with live preview  
3. **Phase 3**: Implement file upload and image management
4. **Phase 4**: Add webbuilder drag & drop functionality
5. **Phase 5**: Connect frontend to use dynamic content from database

## Authentication
- Simple password-based admin access
- Session management
- Protected admin routes

## File Management
- Image upload to `/uploads` directory
- Image optimization and resizing
- Backup system for content changes