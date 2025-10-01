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
    { name: 'Over Ons', href: '#about' },
    { name: 'Shows', href: '#shows' },
    { name: 'Veiligheid', href: '#safety' },
    { name: 'FAQ', href: '#faq' },
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
            <Gift size={28} color="#DC2626" />
            <span>Sinterklaas Genk</span>
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
              onClick={() => smoothScrollTo('#reserveer')}
              className="btn btn-outline"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Reserveer Nu
            </button>
            {/* Admin button only visible if admin session exists */}
            {sessionStorage.getItem('adminAuthenticated') === 'true' && (
              <a 
                href="/admin"
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                <Settings size={16} />
                Admin
              </a>
            )}
          </div>

          {/* Admin info removed - direct access via /admin */}

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