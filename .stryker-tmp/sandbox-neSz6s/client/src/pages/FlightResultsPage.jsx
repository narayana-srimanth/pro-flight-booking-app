import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FlightList from '../components/FlightList';
import BookingModal from '../components/BookingModal';

/**
 * Generates a list of dummy flight objects based on search parameters.
 * Enhances mock data for greater realism and variety.
 * @param {object} searchParams - The search parameters.
 * @returns {Array<object>} An array of dummy flight objects.
 */
const generateDummyFlights = (searchParams) => {
  const flights = [];
  const airlines = ['Air Gemini', 'Vite Airways', 'React Express', 'Tailwind Jets', 'Node Air'];
  const flightTypes = ['Domestic', 'International'];
  const basePrices = [150, 200, 250, 300, 350];
  const durations = ['1h 30m', '2h 00m', '2h 45m', '3h 15m', '4h 00m'];
  const stops = [0, 1, 2];

  for (let i = 0; i < 5; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightType = flightTypes[Math.floor(Math.random() * flightTypes.length)];
    const basePrice = basePrices[Math.floor(Math.random() * basePrices.length)];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const numStops = stops[Math.floor(Math.random() * stops.length)];

    const departureTimeHour = 6 + Math.floor(Math.random() * 16);
    const departureTimeMinute = Math.floor(Math.random() * 4) * 15;
    const departureTime = `${String(departureTimeHour).padStart(2, '0')}:${String(departureTimeMinute).padStart(2, '0')}`;

    const [durationHours, durationMinutes] = duration.split('h ').map(Number);
    let arrivalTimeHour = departureTimeHour + durationHours;
    let arrivalTimeMinute = departureTimeMinute + durationMinutes;
    if (arrivalTimeMinute >= 60) {
      arrivalTimeHour += Math.floor(arrivalTimeMinute / 60);
      arrivalTimeMinute %= 60;
    }
    const arrivalTime = `${String(arrivalTimeHour % 24).padStart(2, '0')}:${String(arrivalTimeMinute).padStart(2, '0')}`;

    flights.push({
      id: `FL-${Date.now()}-${i}`,
      ...searchParams,
      airline: airline,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${100 + i + Math.floor(Math.random() * 99)}`,
      price: basePrice + Math.floor(Math.random() * 100),
      duration: duration,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      stops: numStops,
      type: flightType,
      aircraft: 'Boeing 737',
      seatAvailability: 10 + Math.floor(Math.random() * 50),
      amenities: ['Wi-Fi', 'In-flight entertainment'],
      fareBasis: 'Economy',
    });
  }
  return flights;
};

/**
 * FlightResultsPage component
 * Displays a list of flights and allows booking.
 */
const FlightResultsPage = () => {
  const location = useLocation();
  const { searchParams: initialSearchParams, searchResults: initialSearchResults } = location.state || {};

  const [searchResults, setSearchResults] = useState(initialSearchResults || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(initialSearchParams || {});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!initialSearchResults && initialSearchParams) {
      setIsLoading(true);
      setTimeout(() => {
        try {
          const generated = generateDummyFlights(initialSearchParams);
          setSearchResults(generated);
          setError(null);
        } catch (err) {
          setError("Failed to load flights. Please try searching again.");
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }
  }, [initialSearchResults, initialSearchParams]);

  const handleBooking = async (flight) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: flight.origin,
          destination: flight.destination,
          departureDate: flight.departureDate,
          returnDate: flight.returnDate,
          passengers: flight.passengers,
          selectedFlight: flight,
          extraBags: flight.extraBags,
          mealSelection: flight.mealSelection,
          discountCode: '',
          dateOfBirth: flight.dateOfBirth,
          passengerAge: flight.passengerAge,
          hasInsurance: flight.hasInsurance,
          travelClass: flight.travelClass,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingDetails({
          success: true,
          message: `Booking successful! Booking ID: ${data.booking.bookingId}. Final Price: $${data.booking.finalAmount}`,
          bookingId: data.booking.bookingId,
          finalAmount: data.booking.finalAmount,
        });
        setShowBookingModal(true);
        setSearchResults([]);
      } else {
        setBookingDetails({
          success: false,
          message: data.message || 'Booking failed due to an unknown error.',
        });
        setShowBookingModal(true);
        setError(data.message || 'Booking failed due to an unknown error.');
      }
    } catch (err) {
      setBookingDetails({
        success: false,
        message: "Network error. Could not connect to the booking service.",
      });
      setShowBookingModal(true);
      setError("Network error. Could not connect to the booking service.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setBookingDetails(null);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-8 max-w-4xl mx-auto border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Available Flights</h2>

      {isLoading && (
        <div className="text-center text-blue-600 dark:text-blue-300 text-2xl font-semibold mt-10 p-5 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md">
          <p>Searching for flights...</p>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">Please wait a moment.</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-700 dark:text-red-400 text-xl font-semibold mt-10 p-5 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-lg shadow-md">
          <p>Error: {error}</p>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2">Something went wrong. Please try again.</p>
        </div>
      )}

      {!isLoading && !error && searchResults.length > 0 ? (
        <FlightList flights={searchResults} onBook={handleBooking} />
      ) : (!isLoading && !error && (
        <div className="text-center text-gray-700 dark:text-gray-300 text-2xl font-medium mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="mb-2">No flights found matching your search criteria.</p>
          <p className="text-lg text-gray-500 dark:text-gray-400">Please try adjusting your search parameters from the home page.</p>
        </div>
      ))}

      {showBookingModal && bookingDetails && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={closeModal}
          title={bookingDetails.success ? "Booking Successful!" : "Booking Failed"}
          message={bookingDetails.message}
          success={bookingDetails.success}
          bookingId={bookingDetails.bookingId}
          finalAmount={bookingDetails.finalAmount}
        />
      )}
    </div>
  );
};

export default FlightResultsPage;