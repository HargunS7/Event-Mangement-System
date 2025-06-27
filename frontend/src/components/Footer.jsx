import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 shadow-inner mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-bold text-lg text-white mb-3">EventHub</h5>
            <p className="text-sm text-gray-400">
              Your central place for university club events. Discover, join, and manage events seamlessly.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">View Events</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-3">Connect</h5>
            {/* Placeholder for social media icons or contact info */}
            <p className="text-sm text-gray-400">
              Follow us on social media or get in touch via our contact page.
            </p>
            {/* Example:
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white"><FiFacebook size={20}/></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiTwitter size={20}/></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiInstagram size={20}/></a>
            </div>
            */}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} EventHub. All rights reserved.
            {/* Optionally, add a link to your university or club */}
            {/* <span className="block sm:inline sm:ml-2">Powered by University XYZ</span> */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
