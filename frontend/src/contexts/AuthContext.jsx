import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Hard-coded backend URL for local development
const API = 'http://localhost:8001/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Verify token on app start
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch(`${API}/auth/verify`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token invalid, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (username, password) => {
    console.log('🔍 DEBUG: Login attempt with API:', API);
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      console.log('🔍 DEBUG: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 DEBUG: Login success, setting user and token');
        setUser(data.user);
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
        toast.success('Succesvol ingelogd!');
        return { success: true };
      } else {
        const error = await response.json();
        console.log('🔍 DEBUG: Login error:', error);
        toast.error(error.detail || 'Login failed');
        return { success: false, error: error.detail };
      }
    } catch (error) {
      console.log('🔍 DEBUG: Fetch error:', error);
      toast.error('Verbindingsfout: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Uitgelogd');
  };

  const isAdmin = () => {
    return user && user.is_admin;
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Helper function to make authenticated API calls
  const apiCall = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API}${url}`, {
      ...options,
      headers
    });
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};