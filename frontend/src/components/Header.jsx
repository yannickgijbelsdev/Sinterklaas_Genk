import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const publicNavigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Over de Show', path: '/about' },
    { name: 'Karakters', path: '/characters' },
    { name: 'Data & Locaties', path: '/shows' },
    { name: 'Galerij', path: '/gallery' },
    { name: 'Nieuws', path: '/news' },
    { name: 'Contact', path: '/contact' }
  ];

  const adminNavigationItems = [
    { name: '🎛️ Admin', path: '/admin' },
    { name: '✏️ Live Editor', path: '/live-editor' }
  ];

  const navigationItems = [
    ...publicNavigationItems,
    ...(isAuthenticated() && isAdmin() ? adminNavigationItems : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-red-600">🎭</div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Sinterklaas Show
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Admin info and logout */}
          {isAuthenticated() && isAdmin() && (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                👋 {user?.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-700 hover:text-red-600"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};