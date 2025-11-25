import React from 'react';

/**
 * Renders the footer component for the Flight Booking Application.
 * Displays copyright information and a project-specific message.
 * @param {object} props - Component props.
 * @param {boolean} props.darkMode - Indicates if dark mode is currently active.
 */
const Footer = ({ darkMode }) => { // Added darkMode prop
  return (
    <footer className="bg-gray-900 text-white p-6 text-center shadow-lg mt-12 dark:bg-gray-950 dark:text-gray-300 transition-colors duration-300">
      <div className="container mx-auto">
        {/* Copyright information */}
        <p className="text-lg mb-2">
          &copy; {new Date().getFullYear()} FlightBooker Pro. All rights reserved.
        </p>
        {/* Project-specific tagline */}
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Built with passion for your next adventure. This application serves as a demonstration for a university software testing project.
        </p>
      </div>
    </footer>
  );
};

export default Footer;