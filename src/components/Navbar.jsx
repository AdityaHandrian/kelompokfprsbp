import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '../utils/constants';
import { useAuthContext } from '../contexts/AuthContext';

// Desktop Authentication Section
function AuthSection() {
  const { user, currentUserId, logout, isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return (
      <div className="hidden md:flex items-center space-x-4">
        <Link 
          to={ROUTES.USERS}
          className="flex items-center text-sm hover:text-blue-200 transition"
        >
          <User className="w-4 h-4 mr-1" />
          User #{currentUserId}
        </Link>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        to={ROUTES.USERS}
        className="px-4 py-2 rounded-md bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors"
      >
        Select User
      </Link>
    </div>
  );
}

// Mobile Authentication Section (untuk tampilan HP)
function MobileAuthSection({ setIsOpen }) {
  const { currentUserId, logout, isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return (
      <div className="border-t border-blue-500 mt-2 pt-2">
        <Link
          to={ROUTES.USERS}
          onClick={() => setIsOpen(false)}
          className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
        >
          <User className="w-4 h-4 mr-2" />
          User #{currentUserId}
        </Link>
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      to={ROUTES.USERS}
      onClick={() => setIsOpen(false)}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
    >
      Select User
    </Link>
  );
}

// Main Navbar
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Users', path: ROUTES.USERS },
    { name: 'Catalog', path: ROUTES.CATALOG },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center font-bold">
              RS
            </div>
            <span className="hidden sm:inline text-lg font-bold">RecSys Demo</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Links (Desktop) */}
          <AuthSection />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-blue-500 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-800 text-white'
                    : 'hover:bg-blue-500'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Login / Username + Logout */}
            <MobileAuthSection setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </nav>
  );
}
