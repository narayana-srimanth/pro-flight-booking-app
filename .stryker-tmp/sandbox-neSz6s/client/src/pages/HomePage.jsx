import React from 'react';
import FlightSearchForm from '../components/FlightSearchForm';

function HomePage() { // Removed onSearch and isLoading props
  return (
    <>
      <h1 className="text-5xl font-extrabold text-center text-blue-800 dark:text-blue-400 mb-12 mt-8 leading-tight">
        Discover & Book Your Next Adventure
      </h1>
      <FlightSearchForm /> {/* Removed onSearch and isLoading props */}
    </>
  );
}

export default HomePage;
