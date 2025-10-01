import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Gift, Globe, User, Settings } from 'lucide-react';
import { Button } from './ui/button';
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
    { name: 'BOEK EEN SHOW', href: '#book' },
    { name: 'HOE WERKT HET?', href: '#how-it-works' },
    { name: 'VOORBEELDEN', href: '#examples' },
    { name: 'NIEUWS', href: '#news' },
    { name: 'MEER', href: '#more' }
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
    } else {
      window.location.href = href;
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container" style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 24px',
        background: 'white',
        borderRadius: '50px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginTop: '16px'
      }}>
        <div className="flex items-center justify-between" style={{ padding: '12px 0' }}>
          
          {/* Logo */}
          <div className="header-logo">
            <a href="/" className="flex items-center space-x-3">
              <div style={{
                width: '40px',
                height: '40px',
                background: '#DC2626',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🎅
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: '#DC2626' }}>
                  Sinterklaas
                </div>
                <div className="text-sm font-bold text-gray-600">
                  GENK
                </div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => smoothScrollTo(item.href)}
                className="text-gray-700 font-semibold text-sm hover:text-red-600 transition-colors cursor-pointer"
                style={{ fontWeight: '600' }}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Header CTAs */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div style={{
                width: '32px',
                height: '32px',
                background: '#F3F4F6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={16} color="#666" />
              </div>
            </div>
            
            <button 
              className="flex items-center space-x-2 font-bold text-white px-6 py-3 rounded-full transition-all hover:scale-105"
              style={{ 
                background: 'linear-gradient(45deg, #DC2626, #EF4444)',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
              }}
            >
              <Gift size={16} />
              <span>MIJN BESTELLING</span>
              <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-bold ml-1">
                0
              </span>
            </button>
            
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-yellow-100">
              {allNavigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => smoothScrollTo(item.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                <button 
                  onClick={() => smoothScrollTo('#reserveer')}
                  className="btn btn-outline w-full"
                >
                  Reserveer Nu
                </button>
                {/* Admin button only visible if admin session exists */}
                {sessionStorage.getItem('adminAuthenticated') === 'true' && (
                  <a 
                    href="/admin"
                    className="btn btn-primary w-full"
                  >
                    <Settings size={16} />
                    Admin
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Login modal removed - direct admin access */}
      </div>
    </header>
  );
};