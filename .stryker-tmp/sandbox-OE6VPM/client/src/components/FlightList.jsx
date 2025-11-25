import React, { useState } from 'react';
import { FaPlane, FaClock, FaStopwatch, FaChair, FaWifi, FaTag, FaRegCalendarAlt, FaExchangeAlt } from 'react-icons/fa'; // Added more icons

/**
 * Renders a list of available flights and allows the user to select and book a flight.
 * Features:
 * - Displays flight details including airline, flight number, origin, destination, dates, times, duration, and price.
 * - Allows a single flight to be selected from the list.
 * - Disables the "Book Now" button until a flight is selected.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.flights - An array of flight objects to display.
 * @param {function} props.onBook - Callback function triggered when the "Book Now" button is clicked for a selected flight.
 * @param {boolean} props.darkMode - Indicates if dark mode is currently active (for prop consistency, not direct use here)
 */
const FlightList = ({ flights, onBook, darkMode }) => {
  // State to keep track of the currently selected flight's ID.
  // This ensures that only one flight can be selected at a time for booking.
  const [selectedFlightId, setSelectedFlightId] = useState(null);

  // If no flights are passed or the array is empty, display a message indicating no results.
  if (!flights || flights.length === 0) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300 text-xl font-medium mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="mb-2">No flights found matching your search criteria.</p>
        <p className="text-lg text-gray-500 dark:text-gray-400">Please try adjusting your search parameters.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-5xl mx-auto border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">Available Flights</h2>
      <div className="space-y-6">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className={`flex flex-col md:flex-row items-start md:items-center justify-between p-7 border rounded-2xl shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-xl
                        ${selectedFlightId === flight.id
                          ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50 transform scale-102 dark:border-blue-600 dark:ring-blue-800 dark:bg-gray-700'
                          : 'border-gray-200 bg-white hover:border-blue-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:border-blue-500'
                        }`}
            onClick={() => setSelectedFlightId(flight.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedFlightId(flight.id);
              }
            }}
          >
            {/* Flight Details Section */}
            <div className="flex-grow text-gray-800 dark:text-gray-200 w-full md:w-auto mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <FaPlane className="text-blue-600 dark:text-blue-400 text-3xl" />
                <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">{flight.airline}</span>
                <span className="text-xl text-gray-500 dark:text-gray-400">({flight.flightNumber})</span>
              </div>
              <div className="text-lg text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <FaExchangeAlt className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold">From:</span> {flight.origin}
                <span className="mx-2 text-gray-400 dark:text-gray-500">➔</span>
                <span className="font-semibold">To:</span> {flight.destination}
              </div>
              <div className="text-md text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                <FaRegCalendarAlt className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold">Depart:</span> {flight.departureDate} <span className="font-medium">{flight.departureTime}</span>
                <span className="mx-3 text-gray-400 dark:text-gray-500">|</span>
                <FaClock className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold">Arrive:</span> <span className="font-medium">{flight.arrivalTime}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <FaStopwatch className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold">Duration:</span> {flight.duration}
                <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                <span className="font-semibold">Stops:</span> {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}
                <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                <FaTag className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold">Type:</span> {flight.type}
              </div>
              {flight.returnDate && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold">Return:</span> {flight.returnDate}
                </div>
              )}
              {flight.aircraft && (
                 <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                   <FaChair className="mr-2 text-gray-500 dark:text-gray-400" />
                   Aircraft: {flight.aircraft}
                 </div>
              )}
              {flight.amenities && flight.amenities.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <FaWifi className="mr-2 text-gray-500 dark:text-gray-400" />
                  Amenities: {flight.amenities.join(', ')}
                </div>
              )}
            </div>

            {/* Price and Booking Button Section */}
            <div className="flex flex-col items-end w-full md:w-auto mt-4 md:mt-0">
              <div className="text-5xl font-extrabold text-green-600 dark:text-green-400 mb-3">${flight.price}</div>
              <button
                className={`w-full md:w-auto py-3 px-8 rounded-xl text-white font-bold text-lg tracking-wide transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-75
                            ${selectedFlightId === flight.id
                              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 active:scale-95 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600'
                              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-75'
                            }`}
                disabled={selectedFlightId !== flight.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(flight);
                }}
              >
                {selectedFlightId === flight.id ? 'Book This Flight' : 'Select to Book'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightList;