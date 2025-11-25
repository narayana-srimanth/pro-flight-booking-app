import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; // Import HomePage
import FlightResultsPage from './pages/FlightResultsPage';

/**
 * Main application component for the Flight Booking App.
 * Manages the overall state for flight search results and handles booking actions.
 */
function App() {
  // State to manage dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Effect to apply/remove 'dark' class to the html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
      {/* Header component for navigation and branding */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow container mx-auto p-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<FlightResultsPage />} />
        </Routes>
      </main>
      {/* Footer component for copyright and project details */}
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;