#!/usr/bin/env python3
"""
Admin Password Update Testing
Tests the admin authentication after password update to verify:
1. Old password "admin123" no longer works
2. New password "KYLovie13monx" works correctly
3. Both username formats work with new password
"""

import requests
import json
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

class AdminPasswordTester:
    def __init__(self):
        self.session = requests.Session()
        
    def log_test(self, test_name, success, message=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        print()

    def test_login_credentials(self, username, password, should_work=True):
        """Test login with specific credentials"""
        try:
            login_data = {
                "username": username,
                "password": password
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            
            if should_work:
                if response.status_code == 200:
                    data = response.json()
                    if 'access_token' in data and 'user' in data:
                        user_info = data['user']
                        return True, f"Login successful - User: {user_info.get('username')} ({user_info.get('email')}), Admin: {user_info.get('is_admin')}"
                    else:
                        return False, "Login response missing token or user info"
                else:
                    return False, f"Login failed - Status: {response.status_code}, Response: {response.text}"
            else:
                if response.status_code == 401:
                    return True, f"Login correctly rejected with 401 - {response.json().get('detail', 'Invalid credentials')}"
                else:
                    return False, f"Login should have been rejected but got status: {response.status_code}"
                    
        except Exception as e:
            return False, f"Error during login test: {str(e)}"

    def run_password_update_tests(self):
        """Run comprehensive admin password update tests"""
        print("=" * 80)
        print("ADMIN PASSWORD UPDATE VERIFICATION TESTING")
        print("=" * 80)
        print(f"Testing against: {BACKEND_URL}")
        print("Expected behavior after startup_event fix:")
        print("- Old password 'admin123' should NOT work")
        print("- New password 'KYLovie13monx' should work")
        print("- Both username formats should work with new password")
        print()
        
        test_cases = [
            # Test 1: Old password should NOT work
            {
                "name": "admin/admin123 credentials (OLD - should NOT work)",
                "username": "admin",
                "password": "admin123",
                "should_work": False
            },
            
            # Test 2: New password with admin username should work
            {
                "name": "admin/KYLovie13monx credentials (NEW - should work)",
                "username": "admin",
                "password": "KYLovie13monx",
                "should_work": True
            },
            
            # Test 3: New password with email username should work
            {
                "name": "admin@sinterklaas.com/KYLovie13monx credentials (NEW - should work)",
                "username": "admin@sinterklaas.com",
                "password": "KYLovie13monx",
                "should_work": True
            },
            
            # Test 4: Email with old password should NOT work
            {
                "name": "admin@sinterklaas.com/admin123 credentials (OLD - should NOT work)",
                "username": "admin@sinterklaas.com",
                "password": "admin123",
                "should_work": False
            }
        ]
        
        passed = 0
        total = len(test_cases)
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"Test {i}: {test_case['name']}")
            print("-" * 60)
            
            success, message = self.test_login_credentials(
                test_case['username'], 
                test_case['password'], 
                test_case['should_work']
            )
            
            self.log_test(f"Credentials: {test_case['username']}/{test_case['password']}", success, message)
            
            if success:
                passed += 1
        
        # Summary
        print("=" * 80)
        print("ADMIN PASSWORD UPDATE TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        if passed == total:
            print("🎉 ALL PASSWORD UPDATE TESTS PASSED!")
            print("✅ Old password 'admin123' correctly rejected")
            print("✅ New password 'KYLovie13monx' working correctly")
            print("✅ Both username formats (admin and admin@sinterklaas.com) work with new password")
            print("✅ Password update from startup_event was successful")
            print()
            print("CONCLUSION: The startup_event fix successfully updated the admin password in the database.")
        else:
            print("❌ SOME PASSWORD TESTS FAILED!")
            print()
            if passed < total:
                print("ISSUES IDENTIFIED:")
                for i, test_case in enumerate(test_cases, 1):
                    success, message = self.test_login_credentials(
                        test_case['username'], 
                        test_case['password'], 
                        test_case['should_work']
                    )
                    if not success:
                        expected = "work" if test_case['should_work'] else "NOT work"
                        print(f"- Test {i}: {test_case['username']}/{test_case['password']} should {expected} but didn't behave as expected")
                
                print()
                print("POSSIBLE CAUSES:")
                print("- startup_event() may not have run or failed")
                print("- Database update may have failed")
                print("- Admin user may not exist or have wrong configuration")
                print("- Password hashing may have issues")
            
        return passed == total

def main():
    """Main test execution"""
    tester = AdminPasswordTester()
    success = tester.run_password_update_tests()
    
    if success:
        print("🎯 VERIFICATION COMPLETE: Admin password update working correctly!")
        exit(0)
    else:
        print("⚠️  VERIFICATION FAILED: Admin password update needs investigation!")
        exit(1)

if __name__ == "__main__":
    main()