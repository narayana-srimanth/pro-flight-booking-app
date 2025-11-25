import React from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

/**
 * Renders the header component for the Flight Booking Application.
 * Includes the application title and a simple navigation menu.
 * @param {object} props - Component props.
 * @param {boolean} props.darkMode - Indicates if dark mode is currently active.
 * @param {function} props.setDarkMode - Function to toggle dark mode.
 */
const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-lg dark:from-gray-800 dark:to-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center py-2">
        {/* Application Title/Logo */}
        <h1 className="text-3xl font-extrabold tracking-wide">
          FlightBooker <span className="text-blue-200 dark:text-blue-400">Pro</span>
        </h1>
        {/* Navigation Menu */}
        <nav className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li>
              <a
                href="#"
                className="text-lg font-medium hover:text-blue-200 dark:hover:text-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-lg font-medium hover:text-blue-200 dark:hover:text-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
              >
                My Bookings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-lg font-medium hover:text-blue-200 dark:hover:text-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Contact
              </a>
            </li>
          </ul>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <MdLightMode className="h-6 w-6" />
            ) : (
              <MdDarkMode className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;