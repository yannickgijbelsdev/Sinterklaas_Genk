import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

export const SimpleLogin = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('🔍 SimpleLogin: Starting login attempt...');

    try {
      console.log('🔍 SimpleLogin: Making fetch request to http://localhost:8001/api/auth/login');
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log('🔍 SimpleLogin: Response status:', response.status);

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
      } else {
        const errorText = await response.text();
        console.log('🔍 SimpleLogin: Login failed with response:', errorText);
        toast.error('Ongeldige inloggegevens');
      }
    } catch (error) {
      console.log('🔍 SimpleLogin: Fetch error:', error);
      toast.error('Kan geen verbinding maken met de server. Probeer opnieuw.');
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
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
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
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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
            <p className="text-sm text-yellow-700">Wachtwoord: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};