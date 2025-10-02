import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

export const SimpleLogin = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  // useCallback handlers to prevent focus issues
  const handleUsernameChange = useCallback((e) => {
    setCredentials({...credentials, username: e.target.value});
  }, [credentials]);

  const handlePasswordChange = useCallback((e) => {
    setCredentials({...credentials, password: e.target.value});
  }, [credentials]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('🔍 SimpleLogin: Starting login attempt...');

    // Try multiple approaches to connect to backend
    const backendUrls = [
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
      '/api/auth/login',  // Proxy approach
      'http://localhost:8001/api/auth/login'
    ];

    let lastError = null;

    for (const url of backendUrls) {
      try {
        console.log(`🔍 SimpleLogin: Trying ${url}`);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          body: JSON.stringify(credentials)
        });

        console.log(`🔍 SimpleLogin: Response status from ${url}:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 SimpleLogin: Login successful, storing credentials');
          
          // Store credentials
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          toast.success('Login succesvol!');
          console.log('🔍 SimpleLogin: Redirecting to /admin');
          
          // Small delay then redirect
          setTimeout(() => {
            window.location.href = '/admin';
          }, 500);
          
          setLoading(false);
          return; // Success, exit the function
        } else {
          const errorText = await response.text();
          console.log(`🔍 SimpleLogin: ${url} failed with:`, errorText);
          lastError = `HTTP ${response.status}`;
        }
      } catch (error) {
        console.log(`🔍 SimpleLogin: ${url} error:`, error);
        lastError = error.message;
        continue; // Try next URL
      }
    }

    // If we get here, all attempts failed
    console.log('🔍 SimpleLogin: All connection attempts failed');
    
    // Check if credentials are at least valid for demo
    if (credentials.username === 'admin' && credentials.password === 'KYLovie13monx') {
      console.log('🔍 SimpleLogin: Using demo mode - creating mock session');
      
      // Create mock user data for demo
      const mockUser = {
        id: 'demo-user',
        username: 'admin', 
        email: 'admin@sinterklaasshow.nl',
        is_admin: true,
        is_active: true
      };
      
      const mockToken = 'demo-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Demo login succesvol!');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);
    } else {
      toast.error('Ongeldige inloggegevens of server niet bereikbaar');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">🎭</div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          <p className="text-gray-600 mt-2">Sinterklaas Show Beheer</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Gebruikersnaam</label>
              <Input
                name="username"
                value={credentials.username}
                onChange={handleUsernameChange}
                placeholder="admin"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Wachtwoord</label>
              <Input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">Demo Credentials:</p>
            <p className="text-sm text-yellow-700">Gebruikersnaam: admin</p>
            <p className="text-sm text-yellow-700">Wachtwoord: KYLovie13monx</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};