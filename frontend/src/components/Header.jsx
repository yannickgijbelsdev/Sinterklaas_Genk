import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, TreePine, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Camp Buddy navigation items
  const navigationItems = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Safety', href: '#safety' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Blog', href: '#blog' }
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
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo" onClick={() => smoothScrollTo('#hero')}>
            <TreePine size={28} color="#1F4A33" />
            <span>Camp Buddy</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => smoothScrollTo(item.href)}
                className="nav-link"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Header CTAs */}
          <div className="header-ctas">
            <Globe size={20} className="text-gray-500 cursor-pointer" />
            <button 
              onClick={() => smoothScrollTo('#demo')}
              className="btn btn-secondary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Schedule a demo
            </button>
            <button 
              onClick={() => smoothScrollTo('#app')}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Get the app
            </button>
          </div>

          {/* Admin info and logout */}
          {isAuthenticated() && isAdmin() && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-orange-700">
                  👋 {user?.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {allNavigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => smoothScrollTo(item.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                <button 
                  onClick={() => smoothScrollTo('#demo')}
                  className="btn btn-secondary w-full"
                >
                  Schedule a demo
                </button>
                <button 
                  onClick={() => smoothScrollTo('#app')}
                  className="btn btn-primary w-full"
                >
                  Get the app
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};