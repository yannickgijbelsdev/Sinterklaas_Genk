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
    <header className="sinterklaas-header shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-3xl">🎭</div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent hidden sm:block">
              Sinterklaas Show
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-red-100 hover:text-red-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Admin info and logout */}
          {isAuthenticated() && isAdmin() && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-100 to-red-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-red-700">
                  👋 {user?.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl"
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
              className="text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-red-100">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-red-100 hover:text-red-700'
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