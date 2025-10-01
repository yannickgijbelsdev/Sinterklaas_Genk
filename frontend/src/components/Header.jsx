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

  const navigationItems = [
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
            <button 
              onClick={() => smoothScrollTo('#reserveer')}
              className="btn btn-outline"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Reserveer Nu
            </button>
            <a 
              href="/admin"
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <Settings size={16} />
              Admin
            </a>
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
                <a 
                  href="/admin"
                  className="btn btn-primary w-full"
                >
                  <Settings size={16} />
                  Admin
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Login Form Modal */}
        {showLoginForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Login</h2>
                <button 
                  onClick={() => setShowLoginForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wachtwoord
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};