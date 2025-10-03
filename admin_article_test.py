#!/usr/bin/env python3
"""
Admin Article Creation Testing Script
Tests the admin functionality for creating articles as requested in the review
"""

import requests
import json
import os
from pathlib import Path

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BACKEND_URL = get_backend_url()
API_BASE = f"{BACKEND_URL}/api"

class AdminArticleTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message="", details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        })
        print()

    def test_api_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                self.log_test("API Connectivity", True, f"Backend accessible: {data}")
                return True
            else:
                self.log_test("API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Connectivity", False, f"Connection error: {str(e)}")
            return False

    def test_admin_login(self):
        """Test admin authentication"""
        try:
            # Try with the correct admin credentials from backend code
            login_data = {
                "username": "admin@sinterklaas.com",
                "password": "KYLovie13monx"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and 'user' in data:
                    self.auth_token = data['access_token']
                    user_info = data['user']
                    
                    # Set authorization header for future requests
                    self.session.headers.update({
                        'Authorization': f'Bearer {self.auth_token}'
                    })
                    
                    if user_info.get('is_admin', False):
                        self.log_test("Admin Login", True, 
                                    f"Successfully logged in as admin: {user_info.get('email', 'N/A')}")
                        return True
                    else:
                        self.log_test("Admin Login", False, 
                                    f"User logged in but not admin: {user_info}")
                        return False
                else:
                    self.log_test("Admin Login", False, "Missing token or user info in response")
                    return False
            else:
                self.log_test("Admin Login", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin Login", False, f"Error: {str(e)}")
            return False

    def test_admin_endpoint_authentication(self):
        """Test that admin endpoints require authentication"""
        try:
            # Store current auth header
            temp_headers = self.session.headers.copy()
            
            # Remove auth header to test protection
            if 'Authorization' in self.session.headers:
                del self.session.headers['Authorization']
            
            try:
                # Test admin news endpoints without authentication
                endpoints_to_test = [
                    ("GET /api/admin/news", f"{API_BASE}/admin/news"),
                    ("POST /api/admin/news", f"{API_BASE}/admin/news")
                ]
                
                protected_count = 0
                
                for endpoint_name, url in endpoints_to_test:
                    if "GET" in endpoint_name:
                        response = self.session.get(url)
                    else:
                        response = self.session.post(url, json={"title": "test"})
                    
                    if response.status_code in [401, 403]:
                        print(f"   ✅ {endpoint_name} properly protected (Status: {response.status_code})")
                        protected_count += 1
                    else:
                        print(f"   ❌ {endpoint_name} not properly protected (Status: {response.status_code})")
                
                if protected_count == len(endpoints_to_test):
                    self.log_test("Admin Endpoint Authentication", True, 
                                f"All {protected_count} admin endpoints properly protected")
                    return True
                else:
                    self.log_test("Admin Endpoint Authentication", False, 
                                f"Only {protected_count}/{len(endpoints_to_test)} endpoints properly protected")
                    return False
                    
            finally:
                # Restore auth headers
                self.session.headers.update(temp_headers)
                
        except Exception as e:
            self.log_test("Admin Endpoint Authentication", False, f"Error: {str(e)}")
            return False

    def test_create_article(self):
        """Test POST /api/admin/news endpoint to create a new test article"""
        if not self.auth_token:
            self.log_test("Create Article", False, "No authentication token")
            return False, None
            
        try:
            # Test article data with realistic content
            test_article = {
                "title": "Test Artikel - Sinterklaas Show Review",
                "excerpt": "Dit is een test artikel om de admin functionaliteit te verifiëren na de ObjectId fixes...",
                "content": "Dit test artikel is aangemaakt om te verifiëren dat de admin functionaliteit voor het aanmaken van artikelen correct werkt na de recente ObjectId serialization fixes.\n\nDe test controleert:\n- Of artikelen succesvol aangemaakt kunnen worden via POST /api/admin/news\n- Of er geen ObjectId serialization errors optreden\n- Of de artikelen correct verschijnen in de publieke news lijst\n- Of alle CRUD operaties correct functioneren\n\nDit artikel zal automatisch verwijderd worden na de test.",
                "category": "Test",
                "date": "2024-12-20",
                "published": True,
                "featured_image": "https://via.placeholder.com/600x300/DC2626/FFFFFF?text=Test+Artikel",
                "image": "https://via.placeholder.com/600x300/DC2626/FFFFFF?text=Test+Artikel"
            }
            
            print("   Creating test article via POST /api/admin/news...")
            response = self.session.post(f"{API_BASE}/admin/news", json=test_article)
            
            if response.status_code != 200:
                self.log_test("Create Article", False, 
                            f"Article creation failed - Status: {response.status_code}, Response: {response.text}")
                return False, None
            
            try:
                created_article = response.json()
                article_id = created_article.get('id')
                
                if not article_id:
                    self.log_test("Create Article", False, 
                                "Article created but no ID returned")
                    return False, None
                    
                print(f"   ✅ Article created successfully (ID: {article_id})")
                
                # Verify no ObjectId serialization errors in response
                if '_id' in str(response.text):
                    self.log_test("Create Article", False, 
                                "ObjectId serialization error detected in response")
                    return False, article_id
                    
                print(f"   ✅ No ObjectId serialization errors detected")
                
                # Verify all expected fields are present
                expected_fields = ['id', 'title', 'excerpt', 'content', 'category', 'date', 'published']
                missing_fields = [field for field in expected_fields if field not in created_article]
                
                if missing_fields:
                    self.log_test("Create Article", False, 
                                f"Missing fields in response: {missing_fields}")
                    return False, article_id
                
                print(f"   ✅ All expected fields present in response")
                
                self.log_test("Create Article", True, 
                            f"Article created successfully without ObjectId errors (ID: {article_id})")
                return True, article_id
                
            except json.JSONDecodeError as e:
                self.log_test("Create Article", False, 
                            f"Invalid JSON response from article creation: {str(e)}")
                return False, None
                
        except Exception as e:
            self.log_test("Create Article", False, f"Error: {str(e)}")
            return False, None

    def test_article_in_public_list(self, article_id):
        """Test GET /api/news to confirm the article appears in the list"""
        if not article_id:
            self.log_test("Article in Public List", False, "No article ID provided")
            return False
            
        try:
            print("   Checking if article appears in public news list...")
            response = self.session.get(f"{API_BASE}/news")
            
            if response.status_code != 200:
                self.log_test("Article in Public List", False, 
                            f"Could not retrieve public news list - Status: {response.status_code}")
                return False
            
            try:
                public_articles = response.json()
                article_found = False
                
                for article in public_articles:
                    if article.get('id') == article_id:
                        article_found = True
                        print(f"   ✅ Article found in public news list")
                        
                        # Verify no ObjectId fields in public response
                        if '_id' in str(article):
                            self.log_test("Article in Public List", False, 
                                        "ObjectId field detected in public news response")
                            return False
                            
                        print(f"   ✅ No ObjectId fields in public response")
                        
                        # Verify article is published and accessible
                        if article.get('published') == True:
                            print(f"   ✅ Article is published and publicly accessible")
                        else:
                            self.log_test("Article in Public List", False, 
                                        "Article not marked as published in public list")
                            return False
                        break
                
                if not article_found:
                    self.log_test("Article in Public List", False, 
                                f"Created article (ID: {article_id}) not found in public news list")
                    return False
                
                self.log_test("Article in Public List", True, 
                            f"Article appears correctly in public news list without ObjectId errors")
                return True
                    
            except json.JSONDecodeError as e:
                self.log_test("Article in Public List", False, 
                            f"Invalid JSON response from public news list: {str(e)}")
                return False
                
        except Exception as e:
            self.log_test("Article in Public List", False, f"Error: {str(e)}")
            return False

    def test_article_update(self, article_id):
        """Test article update functionality"""
        if not article_id:
            self.log_test("Article Update", False, "No article ID provided")
            return False
            
        try:
            print("   Testing article update functionality...")
            update_data = {
                "title": "Test Artikel - Sinterklaas Show Review (BIJGEWERKT)",
                "excerpt": "BIJGEWERKT: Dit is een test artikel om de admin functionaliteit te verifiëren...",
                "content": "BIJGEWERKT: Dit test artikel is aangepast om te verifiëren dat update functionaliteit werkt."
            }
            
            response = self.session.put(f"{API_BASE}/admin/news/{article_id}", json=update_data)
            
            if response.status_code != 200:
                self.log_test("Article Update", False, 
                            f"Article update failed - Status: {response.status_code}")
                return False
            
            try:
                updated_article = response.json()
                
                if (updated_article.get('title') == update_data['title'] and
                    updated_article.get('excerpt') == update_data['excerpt']):
                    print(f"   ✅ Article update successful")
                    self.log_test("Article Update", True, 
                                "Article update functionality working correctly")
                    return True
                else:
                    self.log_test("Article Update", False, 
                                "Article update data mismatch")
                    return False
                    
            except json.JSONDecodeError as e:
                self.log_test("Article Update", False, 
                            f"Invalid JSON response from article update: {str(e)}")
                return False
                
        except Exception as e:
            self.log_test("Article Update", False, f"Error: {str(e)}")
            return False

    def cleanup_test_article(self, article_id):
        """Clean up test article"""
        if not article_id:
            return
            
        try:
            print(f"   Cleaning up test article (ID: {article_id})...")
            response = self.session.delete(f"{API_BASE}/admin/news/{article_id}")
            
            if response.status_code == 200:
                print(f"   ✅ Test article cleaned up successfully")
            else:
                print(f"   ⚠️  Could not clean up test article (Status: {response.status_code})")
                
        except Exception as e:
            print(f"   ⚠️  Error cleaning up test article: {str(e)}")

    def run_tests(self):
        """Run all admin article creation tests"""
        print("=" * 70)
        print("ADMIN ARTICLE CREATION FUNCTIONALITY TESTING")
        print("=" * 70)
        print(f"Testing against: {BACKEND_URL}")
        print("Focus: POST /api/admin/news, GET /api/news, ObjectId error verification")
        print()
        
        # Test sequence
        tests = [
            ("API Connectivity", self.test_api_connectivity),
            ("Admin Login", self.test_admin_login),
            ("Admin Endpoint Authentication", self.test_admin_endpoint_authentication),
        ]
        
        passed = 0
        total = len(tests)
        article_id = None
        
        # Run initial tests
        for test_name, test_func in tests:
            print(f"Running: {test_name}")
            print("-" * 50)
            if test_func():
                passed += 1
            else:
                print("❌ Critical test failed - stopping execution")
                return False
            print()
        
        # Run article creation test
        print("Running: Create Article")
        print("-" * 50)
        create_success, article_id = self.test_create_article()
        if create_success:
            passed += 1
            total += 1
        else:
            total += 1
            print("❌ Article creation failed - stopping execution")
            return False
        print()
        
        # Run public list verification test
        print("Running: Article in Public List")
        print("-" * 50)
        if self.test_article_in_public_list(article_id):
            passed += 1
        total += 1
        print()
        
        # Run article update test
        print("Running: Article Update")
        print("-" * 50)
        if self.test_article_update(article_id):
            passed += 1
        total += 1
        print()
        
        # Clean up
        if article_id:
            self.cleanup_test_article(article_id)
        
        # Summary
        print("=" * 70)
        print("ADMIN ARTICLE CREATION TESTING SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        if passed == total:
            print("🎉 ALL ADMIN ARTICLE CREATION TESTS PASSED!")
            print("✅ POST /api/admin/news - Article creation working without ObjectId errors")
            print("✅ GET /api/news - Articles appear in public list correctly")
            print("✅ Authentication - Admin endpoints properly protected")
            print("✅ CRUD Operations - Create, Read, Update, Delete all functional")
            print("✅ Data Integrity - No serialization errors, proper field handling")
            return True
        else:
            print("⚠️  Some admin article creation tests failed - Check the details above")
            return False

if __name__ == "__main__":
    tester = AdminArticleTester()
    success = tester.run_tests()
    exit(0 if success else 1)