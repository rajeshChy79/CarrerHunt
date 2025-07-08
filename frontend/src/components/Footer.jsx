import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowUpRightFromSquare } from 'lucide-react'; // Importing icons

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#071952] to-[#040C24] text-white py-12 md:py-16 mt-24 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">

        {/* Branding & Mission */}
        <div className="flex flex-col items-start">
          <Link to="/" className="text-3xl font-extrabold text-blue-300 mb-3 hover:text-blue-200 transition-colors duration-200">
            VarietyHub
          </Link>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Connecting talent with opportunity. Your journey to your dream job starts here.
          </p>
          <div className="flex space-x-4 mt-2">
            <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Linkedin size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-300">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                Home
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                Browse Jobs
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/companies" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                Companies
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                About Us
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                Contact
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Resources */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-300">Legal & Resources</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/faq" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                FAQ
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                Privacy Policy
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/terms" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                Terms & Conditions
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/sitemap" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                Sitemap
                <ArrowUpRightFromSquare size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-300">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center text-gray-300">
              <Mail size={16} className="mr-2 text-blue-400" />
              <a href="mailto:support@varietyhub.com" className="hover:underline">support@varietyhub.com</a>
            </li>
            <li className="flex items-center text-gray-300">
              <Phone size={16} className="mr-2 text-blue-400" />
              <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
            </li>
            <li className="flex items-center text-gray-300">
              <MapPin size={16} className="mr-2 text-blue-400" />
              <address className="not-italic">Bhopal, Madhya Pradesh, India</address>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright and Bottom Line */}
      <div className="text-center text-sm text-gray-400 mt-12 pt-8 border-t border-gray-700 mx-auto max-w-7xl px-6 lg:px-8">
        &copy; {new Date().getFullYear()} VarietyHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;