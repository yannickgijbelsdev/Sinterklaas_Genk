import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  // One-page navigation items
  const navigationItems = [
    { name: 'Home', href: '#home' },
    { name: 'Galerij', href: '#gallery' },
    { name: 'Nieuws', href: '#news' },
    { name: 'Contact', href: '#contact' }
  ];

  const adminNavigationItems = [
    { name: '🎛️ Admin', href: '/admin' },
    { name: '✏️ Live Editor', href: '/live-editor' }
  ];

  const allNavigationItems = [
    ...navigationItems,
    ...(isAuthenticated() && isAdmin() ? adminNavigationItems : [])
  ];

  const smoothScrollTo = (href) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <header className="sinterklaas-header shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => smoothScrollTo('#home')}>
            <div className="text-3xl">🚢</div>
            <span className="text-xl font-bold text-red-600 hidden sm:block">
              Sinterklaas Show
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {allNavigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => smoothScrollTo(item.href)}
                className="nav-link px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Admin info and logout */}
          {isAuthenticated() && isAdmin() && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-red-100 px-3 py-1 rounded-full">
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
              {allNavigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => smoothScrollTo(item.href)}
                  className="block w-full text-left px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 nav-link"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};