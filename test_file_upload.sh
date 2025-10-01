#!/bin/bash

BACKEND_URL="https://news-manager-genk.preview.emergentagent.com"
API_BASE="${BACKEND_URL}/api"

echo "=== FILE UPLOAD TEST ==="

# Login to get token
echo "1. Getting authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
echo "Token obtained: ${TOKEN:0:50}..."
echo

# Create a test image file
echo "2. Creating test image file..."
echo -e '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82' > test_image.png
echo "Test image created: test_image.png"
echo

# Upload the file
echo "3. Uploading file..."
UPLOAD_RESPONSE=$(curl -s -X POST "$API_BASE/admin/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test_image.png")

echo "Upload response:"
echo "$UPLOAD_RESPONSE" | jq .

# Extract URL and test access
FILE_URL=$(echo "$UPLOAD_RESPONSE" | jq -r '.url')
if [ "$FILE_URL" != "null" ]; then
    echo
    echo "4. Testing file access..."
    FULL_URL="${BACKEND_URL}${FILE_URL}"
    echo "Testing access to: $FULL_URL"
    
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FULL_URL")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ File is accessible (HTTP $HTTP_STATUS)"
    else
        echo "❌ File is not accessible (HTTP $HTTP_STATUS)"
    fi
fi

# Cleanup
rm -f test_image.png

echo
echo "=== FILE UPLOAD TEST COMPLETED ==="
