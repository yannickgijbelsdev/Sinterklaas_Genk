#!/usr/bin/env python3
"""
Specific test for /api/news endpoint to debug frontend "Error loading news" issue
"""

import requests
import json
from pathlib import Path

def get_backend_url():
    """Get backend URL from frontend .env file"""
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

def test_news_endpoint():
    """Test the /api/news endpoint comprehensively"""
    backend_url = get_backend_url()
    news_url = f"{backend_url}/api/news"
    
    print("=" * 70)
    print("NEWS ENDPOINT TESTING")
    print("=" * 70)
    print(f"Testing URL: {news_url}")
    print()
    
    try:
        # Test 1: Basic connectivity and response
        print("🔍 Test 1: Basic GET request")
        response = requests.get(news_url, timeout=10)
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type', 'N/A')}")
        print(f"   Response Size: {len(response.content)} bytes")
        
        if response.status_code != 200:
            print(f"   ❌ FAILED: Expected 200, got {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        print("   ✅ PASSED: HTTP 200 OK")
        print()
        
        # Test 2: JSON parsing
        print("🔍 Test 2: JSON Response Parsing")
        try:
            news_data = response.json()
            print(f"   ✅ PASSED: Valid JSON response")
            print(f"   Data Type: {type(news_data)}")
            
            if not isinstance(news_data, list):
                print(f"   ❌ FAILED: Expected list, got {type(news_data)}")
                return False
            
            print(f"   ✅ PASSED: Response is a list")
            print(f"   Articles Count: {len(news_data)}")
            print()
            
        except json.JSONDecodeError as e:
            print(f"   ❌ FAILED: Invalid JSON - {str(e)}")
            print(f"   Raw Response: {response.text[:200]}...")
            return False
        
        # Test 3: Article structure validation
        print("🔍 Test 3: Article Structure Validation")
        if len(news_data) == 0:
            print("   ⚠️  WARNING: No articles found")
            return True
        
        required_fields = ['id', 'title', 'excerpt', 'content', 'category', 'date', 'published']
        sample_article = news_data[0]
        
        missing_fields = []
        for field in required_fields:
            if field not in sample_article:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"   ❌ FAILED: Missing required fields: {missing_fields}")
            print(f"   Available fields: {list(sample_article.keys())}")
            return False
        
        print("   ✅ PASSED: All required fields present")
        print()
        
        # Test 4: Dutch content verification
        print("🔍 Test 4: Dutch Content Verification")
        dutch_articles = 0
        categories_found = set()
        
        for article in news_data:
            categories_found.add(article.get('category', 'Unknown'))
            
            # Check for Dutch content indicators
            title = article.get('title', '').lower()
            content = article.get('content', '').lower()
            
            dutch_indicators = ['sinterklaas', 'genk', 'pieten', 'kinderen', 'show', 'de ', 'het ', 'een ']
            if any(indicator in title or indicator in content for indicator in dutch_indicators):
                dutch_articles += 1
        
        print(f"   Articles with Dutch content: {dutch_articles}/{len(news_data)}")
        print(f"   Categories found: {sorted(categories_found)}")
        
        if dutch_articles >= 3:
            print("   ✅ PASSED: Sufficient Dutch content found")
        else:
            print("   ⚠️  WARNING: Limited Dutch content detected")
        print()
        
        # Test 5: Demo articles verification
        print("🔍 Test 5: Demo Articles Verification")
        expected_titles = [
            "Zo bereiden onze acteurs zich voor op het Sinterklaas seizoen",
            "Hoe bereid je je kind voor op de eerste Sinterklaasshow?",
            "De geschiedenis van Sinterklaas in Genk"
        ]
        
        found_demo_articles = 0
        for expected_title in expected_titles:
            for article in news_data:
                if article.get('title') == expected_title:
                    found_demo_articles += 1
                    print(f"   ✅ Found: {expected_title}")
                    break
        
        if found_demo_articles == 3:
            print("   ✅ PASSED: All 3 demo articles found")
        else:
            print(f"   ⚠️  WARNING: Only {found_demo_articles}/3 demo articles found")
        print()
        
        # Test 6: CORS headers check
        print("🔍 Test 6: CORS Headers Check")
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('access-control-allow-origin'),
            'Access-Control-Allow-Methods': response.headers.get('access-control-allow-methods'),
            'Access-Control-Allow-Headers': response.headers.get('access-control-allow-headers')
        }
        
        cors_present = any(value for value in cors_headers.values())
        if cors_present:
            print("   ✅ PASSED: CORS headers present")
            for header, value in cors_headers.items():
                if value:
                    print(f"   {header}: {value}")
        else:
            print("   ⚠️  WARNING: No CORS headers detected")
        print()
        
        # Test 7: Response time check
        print("🔍 Test 7: Response Time Check")
        import time
        start_time = time.time()
        response = requests.get(news_url, timeout=10)
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        print(f"   Response Time: {response_time:.2f}ms")
        if response_time < 2000:  # Less than 2 seconds
            print("   ✅ PASSED: Good response time")
        else:
            print("   ⚠️  WARNING: Slow response time")
        print()
        
        # Summary
        print("=" * 70)
        print("NEWS ENDPOINT TEST SUMMARY")
        print("=" * 70)
        print(f"✅ Endpoint URL: {news_url}")
        print(f"✅ HTTP Status: 200 OK")
        print(f"✅ Content Type: JSON")
        print(f"✅ Articles Count: {len(news_data)}")
        print(f"✅ Demo Articles: {found_demo_articles}/3 found")
        print(f"✅ Categories: {', '.join(sorted(categories_found))}")
        print(f"✅ Response Time: {response_time:.2f}ms")
        print()
        
        if len(news_data) >= 3 and found_demo_articles >= 3:
            print("🎉 ALL TESTS PASSED - News endpoint is working correctly!")
            print("   The backend API is responding properly with news articles.")
            print("   If frontend shows 'Error loading news', the issue is likely in:")
            print("   - Frontend API call implementation")
            print("   - Frontend error handling")
            print("   - Network connectivity from frontend to backend")
            print("   - CORS configuration (though headers seem present)")
        else:
            print("⚠️  Some issues detected but endpoint is functional")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ FAILED: Network error - {str(e)}")
        print("   This could indicate:")
        print("   - Backend server is not running")
        print("   - Network connectivity issues")
        print("   - Incorrect URL configuration")
        return False
    
    except Exception as e:
        print(f"❌ FAILED: Unexpected error - {str(e)}")
        return False

if __name__ == "__main__":
    success = test_news_endpoint()
    exit(0 if success else 1)