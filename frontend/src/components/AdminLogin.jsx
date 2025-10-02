import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple password check - in production you'd want proper authentication
    if (password === 'sinterklaas2024') {
      sessionStorage.setItem('adminAuthenticated', 'true');
      toast.success('Succesvol ingelogd!');
      onLogin(true);
    } else {
      toast.error('Onjuist wachtwoord');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600">Sinterklaas Genk Administratie</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Voer admin wachtwoord in..."
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={loading}
            >
              {loading ? 'Inloggen...' : 'Inloggen'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo wachtwoord:</strong> sinterklaas2024
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}