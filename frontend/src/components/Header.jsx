import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Gift, Globe, User, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useLocation } from 'react-router-dom';
// Removed useAuth import - no longer needed

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Removed login functionality - direct admin access

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Login functionality removed - direct admin access

  const navigationItems = [
    { name: 'Bestel je tickets', href: 'https://events.flextickets.nl/event/sinterklaas-en-de-wensmachine' },
    { name: 'Veelgestelde vragen', href: '#faq' },
    { name: 'Foto\'s', href: '#gallery' },
    { name: 'Nieuws', href: '#news' }
  ];

  // Navigation items for mobile menu
  const allNavigationItems = navigationItems;

  const smoothScrollTo = (href) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else if (href.startsWith('http')) {
      window.open(href, '_blank');
      setIsMenuOpen(false);
    } else {
      window.location.href = href;
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent"
    >
      <div className="header-container" style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 16px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '50px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginTop: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="flex items-center justify-between" style={{ padding: '4px 0' }}>
          
          {/* Logo */}
          <div className="header-logo">
            <a href="/" className="flex items-center">
              <img 
                src="/sinterklaas-logo.png" 
                alt="Sinterklaas Genk Logo" 
                style={{ 
                  height: '80px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
                data-edit-id="header_logo"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-end flex-1" style={{ gap: '32px', paddingRight: '8px' }}>
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => smoothScrollTo(item.href)}
                className="text-gray-700 font-medium hover:text-red-600 transition-all duration-200 cursor-pointer hover:scale-105"
                style={{ 
                  fontWeight: '500', 
                  fontSize: '15px',
                  whiteSpace: 'nowrap',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                data-edit-id={`menu_item_${item.name.toLowerCase().replace(/\s+/g, '_')}`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Header CTAs */}
          <div className="flex items-center space-x-2">
            {/* Admin button only visible if admin session exists */}
            {sessionStorage.getItem('adminAuthenticated') === 'true' && (
              <a 
                href="/admin"
                className="btn btn-outline text-xs"
                style={{ padding: '8px 16px' }}
              >
                <Settings size={14} />
                Admin
              </a>
            )}
          </div>

          {/* Admin info removed - direct access via /admin */}

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden flex items-center text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg rounded-b-3xl" style={{ marginTop: '8px' }}>
            <nav className="p-6 space-y-4">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    smoothScrollTo(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
                >
                  {item.name}
                </button>
              ))}
              {/* Mobile CTAs removed */}
            </nav>
          </div>
        )}

        {/* Login modal removed - direct admin access */}
      </div>
    </header>
  );
};