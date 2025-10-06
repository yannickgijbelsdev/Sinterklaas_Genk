#!/bin/bash

BACKEND_URL="https://sinterklaasgenk.preview.emergentagent.com"
API_BASE="${BACKEND_URL}/api"

echo "=== BACKEND API TESTING WITH CURL ==="
echo "Backend URL: $BACKEND_URL"
echo

# Test 1: Health Check
echo "1. Testing API Health Check:"
curl -s -X GET "$API_BASE/" | jq .
echo

# Test 2: Login as admin
echo "2. Testing Admin Login:"
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

echo "$LOGIN_RESPONSE" | jq .

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
echo "Extracted Token: ${TOKEN:0:50}..."
echo

# Test 3: Test protected endpoint without auth (should fail)
echo "3. Testing protected endpoint without authentication (should fail):"
curl -s -X GET "$API_BASE/admin/content" | jq .
echo

# Test 4: Test protected endpoint with auth (should succeed)
echo "4. Testing protected endpoint with authentication:"
curl -s -X GET "$API_BASE/admin/content" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo

# Test 5: Update content for about section
echo "5. Testing content update for 'about' section:"
curl -s -X PUT "$API_BASE/admin/content" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '[{
    "section": "about",
    "type": "text",
    "key": "title",
    "value": "About Us - Updated via CURL Test"
  }]' | jq .
echo

# Test 6: Update content for characters section
echo "6. Testing content update for 'characters' section:"
curl -s -X PUT "$API_BASE/admin/content" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '[{
    "section": "characters",
    "type": "text",
    "key": "main_character",
    "value": "Sinterklaas - Updated via CURL Test"
  }]' | jq .
echo

# Test 7: Update multiple content items
echo "7. Testing multiple content updates in single request:"
curl -s -X PUT "$API_BASE/admin/content" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '[
    {
      "section": "shows",
      "type": "text",
      "key": "upcoming_title",
      "value": "Upcoming Shows - CURL Test"
    },
    {
      "section": "gallery",
      "type": "text",
      "key": "gallery_description",
      "value": "Photo Gallery - CURL Test"
    },
    {
      "section": "contact",
      "type": "text",
      "key": "contact_info",
      "value": "Contact Information - CURL Test"
    }
  ]' | jq .
echo

# Test 8: Verify content persistence
echo "8. Verifying content persistence (retrieving all content):"
curl -s -X GET "$API_BASE/admin/content" \
  -H "Authorization: Bearer $TOKEN" | jq 'map(select(.key | contains("CURL") or contains("curl")))'
echo

echo "=== CURL TESTS COMPLETED ==="
