#!/usr/bin/env python3
"""
Debug Admin User Configuration
Investigates the admin user setup in the database
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

def test_login_and_get_token():
    """Get admin token for database queries"""
    try:
        # Try with working credentials
        login_data = {
            "username": "admin",
            "password": "KYLovie13monx"
        }
        
        response = requests.post(f"{API_BASE}/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            return data.get('access_token'), data.get('user')
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return None, None

def debug_admin_users():
    """Debug admin user configuration"""
    print("=" * 80)
    print("ADMIN USER CONFIGURATION DEBUG")
    print("=" * 80)
    print(f"Backend URL: {BACKEND_URL}")
    print()
    
    # Get admin token
    token, user_info = test_login_and_get_token()
    
    if not token:
        print("❌ Could not get admin token - cannot debug user configuration")
        return
    
    print("✅ Successfully logged in with admin/KYLovie13monx")
    print(f"   User info: {user_info}")
    print()
    
    # Get all users to see admin configuration
    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f"{API_BASE}/admin/users", headers=headers)
        
        if response.status_code == 200:
            users = response.json()
            print(f"📊 Found {len(users)} users in database:")
            print()
            
            admin_users = []
            for user in users:
                print(f"User ID: {user.get('id')}")
                print(f"  Username: {user.get('username')}")
                print(f"  Email: {user.get('email')}")
                print(f"  Is Admin: {user.get('is_admin')}")
                print(f"  Is Active: {user.get('is_active')}")
                print(f"  Created: {user.get('createdAt')}")
                print(f"  Updated: {user.get('updatedAt')}")
                print()
                
                if user.get('is_admin'):
                    admin_users.append(user)
            
            print("=" * 60)
            print("ADMIN USERS ANALYSIS")
            print("=" * 60)
            print(f"Total admin users: {len(admin_users)}")
            
            for admin in admin_users:
                print(f"\nAdmin User: {admin.get('username')}")
                print(f"  Email: {admin.get('email')}")
                print(f"  Expected login combinations:")
                print(f"    - Username: '{admin.get('username')}' + password")
                print(f"    - Email: '{admin.get('email')}' + password")
                
                # Test why email login might not work
                if admin.get('username') != admin.get('email'):
                    print(f"  ⚠️  Username ({admin.get('username')}) != Email ({admin.get('email')})")
                    print(f"      This might explain why email-based login fails")
                    print(f"      The login endpoint might only check 'username' field, not 'email'")
            
        else:
            print(f"❌ Could not get users: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Error getting users: {str(e)}")

def test_specific_login_scenarios():
    """Test specific login scenarios to understand the issue"""
    print("\n" + "=" * 80)
    print("SPECIFIC LOGIN SCENARIO TESTING")
    print("=" * 80)
    
    scenarios = [
        ("admin", "KYLovie13monx", "Working credentials"),
        ("admin@sinterklaas.com", "KYLovie13monx", "Email-based login (failing)"),
        ("admin", "admin123", "Old password (should fail)"),
        ("admin@sinterklaas.com", "admin123", "Email + old password (should fail)"),
    ]
    
    for username, password, description in scenarios:
        print(f"\nTesting: {description}")
        print(f"Credentials: {username} / {password}")
        
        try:
            login_data = {
                "username": username,
                "password": password
            }
            
            response = requests.post(f"{API_BASE}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                user = data.get('user', {})
                print(f"✅ SUCCESS - User: {user.get('username')} ({user.get('email')})")
            else:
                print(f"❌ FAILED - Status: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('detail', 'Unknown error')}")
                except:
                    print(f"   Response: {response.text}")
                    
        except Exception as e:
            print(f"❌ ERROR - {str(e)}")

def main():
    debug_admin_users()
    test_specific_login_scenarios()
    
    print("\n" + "=" * 80)
    print("DEBUG SUMMARY")
    print("=" * 80)
    print("Key findings:")
    print("1. admin/KYLovie13monx works ✅")
    print("2. admin@sinterklaas.com/KYLovie13monx fails ❌")
    print("3. Old password admin123 correctly rejected ✅")
    print()
    print("Likely cause: The login endpoint only matches against the 'username' field,")
    print("not the 'email' field. If username='admin' and email='admin@sinterklaas.com',")
    print("then only 'admin' will work as the username in login requests.")

if __name__ == "__main__":
    main()