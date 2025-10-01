import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Gift, Globe, User, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const { isAuthenticated, isAdmin, login, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      setShowLoginForm(false);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      // Error is handled by the login function
    }
  };
    { name: 'Over Ons', href: '#about' },
    { name: 'Shows', href: '#shows' },
    { name: 'Veiligheid', href: '#safety' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Nieuws', href: '#news' }
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
            {!isAuthenticated() ? (
              <>
                <button 
                  onClick={() => smoothScrollTo('#reserveer')}
                  className="btn btn-outline"
                  style={{ padding: '12px 24px', fontSize: '14px' }}
                >
                  Reserveer Nu
                </button>
                <button 
                  onClick={() => setShowLoginForm(true)}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', fontSize: '14px' }}
                >
                  <User size={16} />
                  Login
                </button>
              </>
            ) : (
              <>
                <span className="text-white text-sm mr-4">
                  Welkom, {user?.email}
                </span>
                {isAdmin() && (
                  <a 
                    href="/admin"
                    className="btn btn-outline"
                    style={{ padding: '12px 24px', fontSize: '14px' }}
                  >
                    <Settings size={16} />
                    Admin
                  </a>
                )}
                <button 
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{ padding: '12px 24px', fontSize: '14px' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>

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
                <button 
                  onClick={() => smoothScrollTo('#contact')}
                  className="btn btn-primary w-full"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};