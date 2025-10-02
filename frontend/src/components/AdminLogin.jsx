import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Login successful, AuthContext will handle state update
        // Navigation will happen automatically due to authentication change
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Network error');
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
              <Label htmlFor="email">Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Gebruikersnaam"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Voer wachtwoord in..."
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
        </CardContent>
      </Card>
    </div>
  );
}