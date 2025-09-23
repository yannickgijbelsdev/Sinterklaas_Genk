import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Use environment variable for backend URL
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('🔍 DEBUG: Initial user from localStorage:', parsedUser.username || 'UNKNOWN');
        return parsedUser;
      } catch (error) {
        console.log('🔍 DEBUG: Failed to parse user from localStorage');
        localStorage.removeItem('user');
        return null;
      }
    }
    console.log('🔍 DEBUG: No user found in localStorage');
    return null;
  });
  
  // Initialize token from localStorage
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    console.log('🔍 DEBUG: Initial token from localStorage:', savedToken ? 'FOUND' : 'NOT FOUND');
    return savedToken;
  });
  
  const [loading, setLoading] = useState(true);

  // Verify token on app start
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        console.log('🔍 DEBUG: Skipping token verification for now - using stored user data');
        // For now, if we have a user in localStorage, consider it valid
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (error) {
            console.log('Failed to parse stored user');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setToken(null);
          }
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
        
        // Set localStorage first, then state
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Then update state
        setUser(data.user);
        setToken(data.access_token);
        
        console.log('🔍 DEBUG: Token saved to localStorage:', localStorage.getItem('token') ? 'SUCCESS' : 'FAILED');
        
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
    console.log('🔍 DEBUG: Logging out, clearing localStorage');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Uitgelogd');
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