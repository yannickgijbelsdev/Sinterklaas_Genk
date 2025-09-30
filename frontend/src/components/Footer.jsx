import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { contactInfo } from '../data/mock';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-4xl">🎭</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                De Magische Sinterklaas Show
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Beleef de meest magische Sinterklaas show van het jaar! Vol surprises, 
              liedjes en natuurlijk Sinterklaas en zijn trouwe helpers.
            </p>
            <div className="flex space-x-4">
              <a
                href={contactInfo.social.facebook}
                className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={contactInfo.social.instagram}
                className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={contactInfo.social.youtube}
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Snelle Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-yellow-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors"></span>
                  Galerij
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-yellow-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors"></span>
                  Nieuws
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Contact</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                  <Mail size={14} />
                </div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-yellow-400 transition-colors duration-200"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                  <Phone size={14} />
                </div>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-yellow-400 transition-colors duration-200"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors mt-1">
                  <MapPin size={14} />
                </div>
                <div>
                  <p>{contactInfo.address.street}</p>
                  <p>{contactInfo.address.city}</p>
                  <p>{contactInfo.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 De Magische Sinterklaas Show. Alle rechten voorbehouden.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                Voorwaarden
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 opacity-5 text-8xl">🎁✨</div>
    </footer>
  );
};