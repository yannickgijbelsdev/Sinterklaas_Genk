import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { contactInfo } from '../data/mock';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-3xl">🎭</div>
              <span className="text-xl font-bold">De Magische Sinterklaas Show</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Beleef de meest magische Sinterklaas show van het jaar! Vol surprises, 
              liedjes en natuurlijk Sinterklaas en zijn trouwe helpers.
            </p>
            <div className="flex space-x-4">
              <a
                href={contactInfo.social.facebook}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href={contactInfo.social.instagram}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href={contactInfo.social.youtube}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Snelle Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors duration-200">
                  Galerij
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors duration-200">
                  Nieuws
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <div>
                  <p>{contactInfo.address.street}</p>
                  <p>{contactInfo.address.city}</p>
                  <p>{contactInfo.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 De Magische Sinterklaas Show. Alle rechten voorbehouden.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Voorwaarden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};