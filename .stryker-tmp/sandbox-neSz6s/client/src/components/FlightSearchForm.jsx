import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUsers, FaBirthdayCake } from 'react-icons/fa';

/**
 * Renders a flight search form with input fields for origin, destination,
 * departure date, return date, number of passengers, and date of birth.
 * Includes client-side validation to ensure valid input before submission.
 */
const FlightSearchForm = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [passengerAge, setPassengerAge] = useState(undefined);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [travelClass, setTravelClass] = useState('economy');
  const [mealSelection, setMealSelection] = useState('none');
  const [extraBags, setExtraBags] = useState(0);

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


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
   * Performs client-side validation on all form fields.
   * Updates the `errors` state with specific error messages.
   * @returns {boolean} True if all form fields are valid, false otherwise.
   */
  const validateForm = () => {
    let newErrors = {};
    const depDate = new Date(departureDate);
    const retDate = new Date(returnDate);
    const dob = new Date(dateOfBirth);
    const now = new Date();

    if (!origin || origin.trim().length === 0) {
      newErrors.origin = 'Origin city is required.';
    }

    if (!destination || destination.trim().length === 0) {
      newErrors.destination = 'Destination city is required.';
    }

    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required.';
    } else if (new Date(departureDate) < new Date(today)) {
      newErrors.departureDate = 'Departure date cannot be in the past.';
    }


    if (returnDate) {
      if (retDate < depDate) {
        newErrors.returnDate = 'Return date cannot be before departure date.';
      }
    }

    if (passengers === null || passengers < 1) {
      newErrors.passengers = 'Number of passengers must be at least 1.';
    } else if (isNaN(passengers)) {
      newErrors.passengers = 'Number of passengers must be a number.';
    }

    if (dateOfBirth) {
      if (dob > now) {
        newErrors.dateOfBirth = 'Date of Birth cannot be in the future.';
      }
    }

    if (extraBags < 0 || isNaN(extraBags)) {
      newErrors.extraBags = 'Extra bags must be a non-negative number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [origin, destination, departureDate, returnDate, passengers, dateOfBirth, passengerAge, hasInsurance, travelClass, mealSelection, extraBags]);

  /**
   * Handles the flight search operation, simulates an API call, and navigates to results.
   * @param {object} searchParams - Parameters for the flight search.
   */
  const handleSearch = (searchParams) => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        const generatedFlights = generateDummyFlights(searchParams);
        navigate('/flights', { state: { searchParams, searchResults: generatedFlights } });
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  /**
   * Handles the form submission event.
   * Prevents default form submission, validates the form, and calls the onSearch callback if valid.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSearch({ origin, destination, departureDate, returnDate, passengers, dateOfBirth, passengerAge, hasInsurance, travelClass, mealSelection, extraBags });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-8 max-w-4xl mx-auto border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Find Your Next Adventure</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="origin" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center">
              <FaPlaneDeparture className="mr-2 text-blue-500" /> Origin City/Airport
            </label>
            <input
              type="text"
              id="origin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-500 transition duration-150 ease-in-out"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g., New York (NYC)"
              aria-invalid={!!errors.origin}
              aria-describedby="origin-error"
            />
            {errors.origin && <p id="origin-error" className="text-red-600 text-xs italic mt-1">{errors.origin}</p>}
          </div>
          <div>
            <label htmlFor="destination" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center">
              <FaPlaneArrival className="mr-2 text-blue-500" /> Destination City/Airport
            </label>
            <input
              type="text"
              id="destination"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-500 transition duration-150 ease-in-out"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., London (LHR)"
              aria-invalid={!!errors.destination}
              aria-describedby="destination-error"
            />
            {errors.destination && <p id="destination-error" className="text-red-600 text-xs italic mt-1">{errors.destination}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="departureDate" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" /> Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={today}
              aria-invalid={!!errors.departureDate}
              aria-describedby="departureDate-error"
            />
            {errors.departureDate && <p id="departureDate-error" className="text-red-600 text-xs italic mt-1">{errors.departureDate}</p>}
          </div>
          <div>
            <label htmlFor="returnDate" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" /> Return Date (Optional)
            </label>
            <input
              type="date"
              id="returnDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={departureDate || today}
              disabled={!departureDate}
              aria-invalid={!!errors.returnDate}
              aria-describedby="returnDate-error"
            />
            {errors.returnDate && <p id="returnDate-error" className="text-red-600 text-xs italic mt-1">{errors.returnDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="passengers" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center">
              <FaUsers className="mr-2 text-blue-500" /> Number of Passengers
            </label>
            <input
              type="number"
              id="passengers"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value, 10) || 0)}
              min="1"
              aria-invalid={!!errors.passengers}
              aria-describedby="passengers-error"
            />
            {errors.passengers && <p id="passengers-error" className="text-red-600 text-xs italic mt-1">{errors.passengers}</p>}
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center">
              <FaBirthdayCake className="mr-2 text-blue-500" /> Date of Birth (Main Passenger)
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
              value={dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                if (e.target.value) {
                  const birthDate = new Date(e.target.value);
                  const todayDate = new Date();
                  let age = todayDate.getFullYear() - birthDate.getFullYear();
                  const m = todayDate.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
                    age--;
                  }
                  setPassengerAge(age);
                } else {
                  setPassengerAge(undefined);
                }
              }}
              max={today}
              aria-invalid={!!errors.dateOfBirth}
              aria-describedby="dateOfBirth-error"
            />
            {errors.dateOfBirth && <p id="dateOfBirth-error" className="text-red-600 text-xs italic mt-1">{errors.dateOfBirth}</p>}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Advanced Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="travelClass" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Travel Class
              </label>
              <select
                id="travelClass"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>

            <div>
              <label htmlFor="mealSelection" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Meal Preference
              </label>
              <select
                id="mealSelection"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
                value={mealSelection}
                onChange={(e) => setMealSelection(e.target.value)}
              >
                <option value="none">No Meal</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>

            <div>
              <label htmlFor="extraBags" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Extra Checked Bags
              </label>
              <input
                type="number"
                id="extraBags"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
                value={extraBags}
                onChange={(e) => setExtraBags(parseInt(e.target.value, 10) || 0)}
                min="0"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-1 flex items-center mt-4">
              <input
                type="checkbox"
                id="hasInsurance"
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 transition duration-150 ease-in-out"
                checked={hasInsurance}
                onChange={(e) => setHasInsurance(e.target.checked)}
              />
              <label htmlFor="hasInsurance" className="ml-2 block text-gray-700 dark:text-gray-300 text-sm font-semibold">
                Add Travel Insurance
              </label>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg tracking-wide transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75 ${
            isFormValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-75'
          }`}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm;