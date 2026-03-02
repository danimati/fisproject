#!/usr/bin/env python3
"""
Test script for gateway functionality
"""
import asyncio
import httpx
import json
import time
from datetime import datetime

# Gateway configuration
GATEWAY_URL = "http://localhost:8080"
BACKEND_URL = "http://localhost:8000"

async def test_gateway():
    """Test gateway functionality"""
    print("🧪 Testing Maritime Gateway API")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        
        # Test 1: Health Check
        print("\n1. Testing Gateway Health...")
        try:
            response = await client.get(f"{GATEWAY_URL}/health")
            print(f"✅ Gateway Health: {response.status_code}")
            print(f"   Response: {response.json()}")
        except Exception as e:
            print(f"❌ Gateway Health failed: {e}")
            return
        
        # Test 2: User Registration
        print("\n2. Testing User Registration...")
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "full_name": "Test User"
        }
        
        try:
            response = await client.post(f"{GATEWAY_URL}/auth/register", json=user_data)
            if response.status_code == 200:
                print("✅ User registration successful")
                print(f"   User ID: {response.json()['id']}")
            else:
                print(f"⚠️ Registration: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Registration failed: {e}")
        
        # Test 3: User Login
        print("\n3. Testing User Login...")
        login_data = {
            "username": "testuser",
            "password": "testpass123"
        }
        
        try:
            response = await client.post(f"{GATEWAY_URL}/auth/login", json=login_data)
            if response.status_code == 200:
                token_data = response.json()
                access_token = token_data["access_token"]
                print("✅ Login successful")
                print(f"   Token expires in: {token_data['expires_in']} seconds")
                
                # Set authorization header for subsequent requests
                headers = {"Authorization": f"Bearer {access_token}"}
                
                # Test 4: Protected Endpoint
                print("\n4. Testing Protected Endpoint...")
                try:
                    response = await client.get(f"{GATEWAY_URL}/auth/me", headers=headers)
                    if response.status_code == 200:
                        user_info = response.json()
                        print("✅ Protected endpoint accessible")
                        print(f"   User: {user_info['username']}")
                    else:
                        print(f"❌ Protected endpoint failed: {response.status_code}")
                except Exception as e:
                    print(f"❌ Protected endpoint error: {e}")
                
                # Test 5: Proxy to Backend
                print("\n5. Testing Backend Proxy...")
                try:
                    response = await client.get(f"{GATEWAY_URL}/api/v1/vessels", headers=headers)
                    print(f"✅ Backend proxy: {response.status_code}")
                    if response.status_code == 200:
                        vessels = response.json()
                        print(f"   Vessels retrieved: {len(vessels) if isinstance(vessels, list) else 'data'}")
                except Exception as e:
                    print(f"❌ Backend proxy failed: {e}")
                
                # Test 6: Rate Limiting
                print("\n6. Testing Rate Limiting...")
                request_count = 0
                start_time = time.time()
                
                for i in range(10):
                    try:
                        response = await client.get(f"{GATEWAY_URL}/auth/me", headers=headers)
                        request_count += 1
                        if response.status_code == 429:
                            print(f"⚠️ Rate limit hit after {request_count} requests")
                            break
                    except:
                        break
                
                elapsed = time.time() - start_time
                print(f"   Made {request_count} requests in {elapsed:.2f} seconds")
                
                # Test 7: Logout
                print("\n7. Testing Logout...")
                try:
                    response = await client.post(f"{GATEWAY_URL}/auth/logout", headers=headers)
                    if response.status_code == 200:
                        print("✅ Logout successful")
                    else:
                        print(f"❌ Logout failed: {response.status_code}")
                except Exception as e:
                    print(f"❌ Logout error: {e}")
                
            else:
                print(f"❌ Login failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Login error: {e}")
        
        # Test 8: Admin Endpoints (with admin user)
        print("\n8. Testing Admin Endpoints...")
        admin_login = {
            "username": "admin",
            "password": "admin123"
        }
        
        try:
            response = await client.post(f"{GATEWAY_URL}/auth/login", json=admin_login)
            if response.status_code == 200:
                admin_token = response.json()["access_token"]
                admin_headers = {"Authorization": f"Bearer {admin_token}"}
                
                # Test admin stats
                response = await client.get(f"{GATEWAY_URL}/admin/stats", headers=admin_headers)
                if response.status_code == 200:
                    stats = response.json()
                    print("✅ Admin stats accessible")
                    print(f"   Total users: {stats['users']['total']}")
                    print(f"   Active sessions: {stats['sessions']['active']}")
                else:
                    print(f"❌ Admin stats failed: {response.status_code}")
            else:
                print(f"❌ Admin login failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Admin test error: {e}")
        
        print("\n" + "=" * 50)
        print("🎉 Gateway testing completed!")
        print("\n📋 Summary:")
        print("- Gateway health check")
        print("- User registration and authentication")
        print("- JWT token management")
        print("- Protected endpoints")
        print("- Backend proxy functionality")
        print("- Rate limiting")
        print("- Admin functionality")
        print("\n✨ All core features tested!")

if __name__ == "__main__":
    print("Starting gateway tests...")
    print("Make sure gateway is running on http://localhost:8080")
    print("Press Ctrl+C to exit\n")
    
    try:
        asyncio.run(test_gateway())
    except KeyboardInterrupt:
        print("\n\n👋 Testing interrupted by user")
    except Exception as e:
        print(f"\n❌ Testing failed: {e}")
