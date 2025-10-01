#!/usr/bin/env python3
"""
Backend Testing Suite for Live Editing Functionality
Tests authentication, content management, and file upload endpoints
"""

import requests
import json
import os
import tempfile
from pathlib import Path
import sys

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

class BackendTester:
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

    def test_health_check(self):
        """Test basic API connectivity"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                self.log_test("API Health Check", True, f"Response: {data}")
                return True
            else:
                self.log_test("API Health Check", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_admin_user_creation(self):
        """Test that default admin user exists with correct credentials"""
        try:
            # Try to login with expected admin credentials
            login_data = {
                "username": "admin", 
                "password": "admin123"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if 'user' in data:
                    user_info = data['user']
                    expected_email = "admin@sinterklaas.com"
                    
                    if (user_info.get('email') == expected_email and 
                        user_info.get('username') == 'admin' and
                        user_info.get('is_admin', False)):
                        self.log_test("Admin User Creation", True, 
                                    f"Default admin user exists: {user_info['email']} with admin privileges")
                        return True
                    else:
                        self.log_test("Admin User Creation", False, 
                                    f"Admin user exists but incorrect details: email={user_info.get('email')}, admin={user_info.get('is_admin')}")
                        return False
                else:
                    self.log_test("Admin User Creation", False, "No user info in login response")
                    return False
            else:
                self.log_test("Admin User Creation", False, 
                            f"Cannot login with admin/admin123 credentials (Status: {response.status_code})")
                return False
                
        except Exception as e:
            self.log_test("Admin User Creation", False, f"Error: {str(e)}")
            return False

    def test_admin_login(self):
        """Test admin authentication with admin@sinterklaas.com/admin123"""
        try:
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and 'user' in data:
                    self.auth_token = data['access_token']
                    user_info = data['user']
                    
                    # Verify admin privileges and correct email
                    if (user_info.get('is_admin', False) and 
                        user_info.get('email') == 'admin@sinterklaas.com'):
                        self.log_test("Admin Login API", True, 
                                    f"Successfully logged in as {user_info['username']} ({user_info['email']}) with admin privileges")
                        
                        # Set authorization header for future requests
                        self.session.headers.update({
                            'Authorization': f'Bearer {self.auth_token}'
                        })
                        return True
                    else:
                        self.log_test("Admin Login API", False, 
                                    f"User logged in but missing admin privileges or wrong email: admin={user_info.get('is_admin')}, email={user_info.get('email')}")
                        return False
                else:
                    self.log_test("Admin Login API", False, "Missing token or user info in response")
                    return False
            else:
                self.log_test("Admin Login API", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin Login API", False, f"Error: {str(e)}")
            return False

    def test_login_with_wrong_credentials(self):
        """Test login API with incorrect credentials for error handling"""
        try:
            wrong_credentials = [
                {"username": "admin", "password": "wrongpassword"},
                {"username": "wronguser", "password": "admin123"},
                {"username": "admin", "password": ""},
                {"username": "", "password": "admin123"}
            ]
            
            success_count = 0
            for i, creds in enumerate(wrong_credentials):
                response = self.session.post(f"{API_BASE}/auth/login", json=creds)
                
                if response.status_code == 401:
                    success_count += 1
                    print(f"   ✅ Wrong credentials test {i+1}: Correctly rejected (401)")
                else:
                    print(f"   ❌ Wrong credentials test {i+1}: Should have returned 401, got {response.status_code}")
            
            if success_count == len(wrong_credentials):
                self.log_test("Login Error Handling", True, 
                            f"All {success_count} wrong credential attempts correctly rejected with 401")
                return True
            else:
                self.log_test("Login Error Handling", False, 
                            f"Only {success_count}/{len(wrong_credentials)} wrong credentials properly rejected")
                return False
                
        except Exception as e:
            self.log_test("Login Error Handling", False, f"Error: {str(e)}")
            return False

    def test_token_verification(self):
        """Test JWT token verification via POST /api/auth/verify"""
        if not self.auth_token:
            self.log_test("JWT Token Verification", False, "No auth token available")
            return False
            
        try:
            response = self.session.post(f"{API_BASE}/auth/verify")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('valid', False) and 'user' in data:
                    user_info = data['user']
                    if user_info.get('is_admin', False):
                        self.log_test("JWT Token Verification", True, 
                                    f"Token valid for admin user: {user_info['username']} ({user_info.get('email', 'N/A')})")
                        return True
                    else:
                        self.log_test("JWT Token Verification", False, 
                                    f"Token valid but user is not admin: {user_info}")
                        return False
                else:
                    self.log_test("JWT Token Verification", False, "Token not valid or missing user info")
                    return False
            else:
                self.log_test("JWT Token Verification", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("JWT Token Verification", False, f"Error: {str(e)}")
            return False

    def test_admin_protected_endpoints(self):
        """Test admin-protected endpoints like GET /api/admin/content"""
        if not self.auth_token:
            self.log_test("Admin Protected Endpoints", False, "No auth token available")
            return False
            
        try:
            # Test GET /api/admin/content with valid admin token
            response = self.session.get(f"{API_BASE}/admin/content")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Admin Protected Endpoints", True, 
                            f"Admin endpoint accessible with valid token, returned {len(data)} items")
                return True
            else:
                self.log_test("Admin Protected Endpoints", False, 
                            f"Admin endpoint not accessible with valid token (Status: {response.status_code})")
                return False
                
        except Exception as e:
            self.log_test("Admin Protected Endpoints", False, f"Error: {str(e)}")
            return False

    def test_protected_endpoint_without_auth(self):
        """Test that protected endpoints require authentication"""
        # Temporarily remove auth header
        temp_headers = self.session.headers.copy()
        if 'Authorization' in self.session.headers:
            del self.session.headers['Authorization']
        
        try:
            response = self.session.get(f"{API_BASE}/admin/content")
            
            if response.status_code == 401 or response.status_code == 403:
                self.log_test("Protected Endpoint Security", True, 
                            f"Correctly rejected unauthorized request (Status: {response.status_code})")
                result = True
            else:
                self.log_test("Protected Endpoint Security", False, 
                            f"Should have rejected unauthorized request (Status: {response.status_code})")
                result = False
                
        except Exception as e:
            self.log_test("Protected Endpoint Security", False, f"Error: {str(e)}")
            result = False
        finally:
            # Restore auth headers
            self.session.headers.update(temp_headers)
            
        return result

    def test_get_content(self):
        """Test GET /api/admin/content endpoint"""
        if not self.auth_token:
            self.log_test("Get Content", False, "No authentication token")
            return False
            
        try:
            response = self.session.get(f"{API_BASE}/admin/content")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Content", True, 
                            f"Retrieved {len(data)} content items")
                return True
            else:
                self.log_test("Get Content", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Content", False, f"Error: {str(e)}")
            return False

    def test_update_content(self):
        """Test PUT /api/admin/content endpoint"""
        if not self.auth_token:
            self.log_test("Update Content", False, "No authentication token")
            return False
            
        try:
            # Test content updates for different sections
            test_content = [
                {
                    "section": "about",
                    "type": "text",
                    "key": "title",
                    "value": "Test About Title - Updated via API"
                },
                {
                    "section": "characters",
                    "type": "text", 
                    "key": "description",
                    "value": "Test Characters Description - Updated via API"
                },
                {
                    "section": "shows",
                    "type": "text",
                    "key": "upcoming_shows_title",
                    "value": "Test Shows Title - Updated via API"
                }
            ]
            
            response = self.session.put(f"{API_BASE}/admin/content", json=test_content)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Update Content", True, 
                            f"Updated content successfully: {data.get('message', 'Success')}")
                
                # Verify the content was actually updated
                return self.verify_content_updates(test_content)
            else:
                self.log_test("Update Content", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Update Content", False, f"Error: {str(e)}")
            return False

    def verify_content_updates(self, test_content):
        """Verify that content updates were persisted"""
        try:
            response = self.session.get(f"{API_BASE}/admin/content")
            
            if response.status_code == 200:
                all_content = response.json()
                
                verified_count = 0
                for test_item in test_content:
                    for content_item in all_content:
                        if (content_item.get('section') == test_item['section'] and 
                            content_item.get('key') == test_item['key'] and
                            content_item.get('value') == test_item['value']):
                            verified_count += 1
                            break
                
                if verified_count == len(test_content):
                    self.log_test("Content Persistence Verification", True, 
                                f"All {verified_count} content updates verified in database")
                    return True
                else:
                    self.log_test("Content Persistence Verification", False, 
                                f"Only {verified_count}/{len(test_content)} updates verified")
                    return False
            else:
                self.log_test("Content Persistence Verification", False, 
                            f"Could not retrieve content for verification")
                return False
                
        except Exception as e:
            self.log_test("Content Persistence Verification", False, f"Error: {str(e)}")
            return False

    def test_file_upload(self):
        """Test POST /api/admin/upload endpoint"""
        if not self.auth_token:
            self.log_test("File Upload", False, "No authentication token")
            return False
            
        try:
            # Create a temporary test image file
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                # Create a simple PNG file (1x1 pixel)
                png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82'
                temp_file.write(png_data)
                temp_file_path = temp_file.name
            
            try:
                with open(temp_file_path, 'rb') as f:
                    files = {'file': ('test_image.png', f, 'image/png')}
                    response = self.session.post(f"{API_BASE}/admin/upload", files=files)
                
                if response.status_code == 200:
                    data = response.json()
                    if 'url' in data and 'filename' in data:
                        self.log_test("File Upload", True, 
                                    f"File uploaded successfully: {data['url']}")
                        
                        # Test if uploaded file is accessible
                        return self.test_uploaded_file_access(data['url'])
                    else:
                        self.log_test("File Upload", False, "Missing url or filename in response")
                        return False
                else:
                    self.log_test("File Upload", False, 
                                f"Status: {response.status_code}, Response: {response.text}")
                    return False
                    
            finally:
                # Clean up temp file
                os.unlink(temp_file_path)
                
        except Exception as e:
            self.log_test("File Upload", False, f"Error: {str(e)}")
            return False

    def test_uploaded_file_access(self, file_url):
        """Test that uploaded files are accessible"""
        try:
            # Construct full URL for uploaded file
            full_url = f"{BACKEND_URL}{file_url}"
            
            response = self.session.get(full_url)
            
            if response.status_code == 200:
                self.log_test("Uploaded File Access", True, 
                            f"Uploaded file accessible at: {full_url}")
                return True
            else:
                self.log_test("Uploaded File Access", False, 
                            f"File not accessible (Status: {response.status_code})")
                return False
                
        except Exception as e:
            self.log_test("Uploaded File Access", False, f"Error: {str(e)}")
            return False

    def test_content_sections(self):
        """Test content management for all page sections"""
        if not self.auth_token:
            self.log_test("Content Sections Test", False, "No authentication token")
            return False
            
        sections_to_test = ['about', 'characters', 'shows', 'gallery', 'news', 'contact']
        success_count = 0
        
        for section in sections_to_test:
            try:
                test_content = [{
                    "section": section,
                    "type": "text",
                    "key": "test_key",
                    "value": f"Test content for {section} section - API Test"
                }]
                
                response = self.session.put(f"{API_BASE}/admin/content", json=test_content)
                
                if response.status_code == 200:
                    success_count += 1
                    print(f"   ✅ {section} section content update successful")
                else:
                    print(f"   ❌ {section} section content update failed (Status: {response.status_code})")
                    
            except Exception as e:
                print(f"   ❌ {section} section content update error: {str(e)}")
        
        if success_count == len(sections_to_test):
            self.log_test("Content Sections Test", True, 
                        f"All {success_count} sections updated successfully")
            return True
        else:
            self.log_test("Content Sections Test", False, 
                        f"Only {success_count}/{len(sections_to_test)} sections updated successfully")
            return False

    def run_all_tests(self):
        """Run comprehensive backend testing suite"""
        print("=" * 60)
        print("BACKEND TESTING SUITE - LIVE EDITING FUNCTIONALITY")
        print("=" * 60)
        print(f"Testing against: {BACKEND_URL}")
        print()
        
        # Test sequence
        tests = [
            ("API Connectivity", self.test_health_check),
            ("Admin Authentication", self.test_admin_login),
            ("JWT Token Verification", self.test_token_verification),
            ("Protected Endpoint Security", self.test_protected_endpoint_without_auth),
            ("Content Retrieval", self.test_get_content),
            ("Content Updates", self.test_update_content),
            ("File Upload", self.test_file_upload),
            ("All Page Sections", self.test_content_sections),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"Running: {test_name}")
            print("-" * 40)
            if test_func():
                passed += 1
            print()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        if passed == total:
            print("🎉 ALL TESTS PASSED - Backend is working correctly!")
        else:
            print("⚠️  Some tests failed - Check the details above")
            
        return passed == total

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()