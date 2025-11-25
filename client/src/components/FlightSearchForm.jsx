import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUsers, FaBirthdayCake } from 'react-icons/fa';

/**
 * Renders a flight search form with input fields for origin, destination,
 * departure date, return date, number of passengers, and date of birth.
 * Includes client-side validation to ensure valid input before submission.
 */
const FlightSearchForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Get today's date in YYYY-MM-DD format for date input minimums and DOB maximum.
  const today = new Date().toISOString().split('T')[0];

  // State variables for each form input field
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1); // Default to 1 passenger
  const [dateOfBirth, setDateOfBirth] = useState(''); // Date of Birth for specific validation
  const [passengerAge, setPassengerAge] = useState(undefined); // Derived from dateOfBirth
  const [hasInsurance, setHasInsurance] = useState(false);
  const [travelClass, setTravelClass] = useState('economy'); // Default to economy
  const [mealSelection, setMealSelection] = useState('none'); // Default to none
  const [extraBags, setExtraBags] = useState(0); // Default to 0

  // State to hold validation error messages for each field
  const [errors, setErrors] = useState({});
  // State to track the overall validity of the form, used to enable/disable the submit button
  const [isFormValid, setIsFormValid] = useState(false);
  // Internal loading state for the search form
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

    for (let i = 0; i < 5; i++) { // Generate 5 dummy flights
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const flightType = flightTypes[Math.floor(Math.random() * flightTypes.length)];
      const basePrice = basePrices[Math.floor(Math.random() * basePrices.length)];
      const duration = durations[Math.floor(Math.random() * durations.length)];
      const numStops = stops[Math.floor(Math.random() * stops.length)];

      const departureTimeHour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
      const departureTimeMinute = Math.floor(Math.random() * 4) * 15; // 00, 15, 30, 45
      const departureTime = `${String(departureTimeHour).padStart(2, '0')}:${String(departureTimeMinute).padStart(2, '0')}`;

      // Simulate arrival time based on duration (simplistic)
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
        // Embed all searchParams directly into the flight object
        ...searchParams, // This will spread all search parameters here
        airline: airline, // Overwrite with generated airline
        flightNumber: `${airline.substring(0, 2).toUpperCase()}${100 + i + Math.floor(Math.random() * 99)}`,
        price: basePrice + Math.floor(Math.random() * 100), // Overwrite with generated price
        duration: duration,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        stops: numStops,
        type: flightType,
        // Additional mock details
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
    let newErrors = {}; // Object to collect all validation errors
    const depDate = new Date(departureDate);
    const retDate = new Date(returnDate);
    const dob = new Date(dateOfBirth);
    const now = new Date(); // Current date for comparison

    // Validation for Origin field
    if (!origin || origin.trim().length === 0) {
      newErrors.origin = 'Origin city is required.';
    }

    // Validation for Destination field
    if (!destination || destination.trim().length === 0) {
      newErrors.destination = 'Destination city is required.';
    }

    // Validation for Departure Date field
    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required.';
    } else if (new Date(departureDate) < new Date(today)) {
      // Ensure departure date is not in the past
      newErrors.departureDate = 'Departure date cannot be in the past.';
    }


    // Validation for Return Date field (only if provided)
    if (returnDate) {
      if (retDate < depDate) {
        newErrors.returnDate = 'Return date cannot be before departure date.';
      }
    }

    // Validation for Number of Passengers field
    if (passengers === null || passengers < 1) { // Passengers must be at least 1
      newErrors.passengers = 'Number of passengers must be at least 1.';
    } else if (isNaN(passengers)) {
      newErrors.passengers = 'Number of passengers must be a number.';
    }

    // Validation for Date of Birth field
    if (dateOfBirth) {
      if (dob > now) { // Date of Birth cannot be in the future
        newErrors.dateOfBirth = 'Date of Birth cannot be in the future.';
      }
      // You could add age-specific validations here (e.g., must be 18+)
    }

    // New Validations for advanced options
    if (extraBags < 0 || isNaN(extraBags)) {
      newErrors.extraBags = 'Extra bags must be a non-negative number.';
    }
    // No specific validation needed for hasInsurance (boolean) or travelClass (dropdown) as they have defaults/predefined options

    // Update the errors state with the collected errors
    setErrors(newErrors);
    // Determine overall form validity
    return Object.keys(newErrors).length === 0;
  };

  // Effect hook to re-validate the form whenever relevant input states change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [origin, destination, departureDate, returnDate, passengers, dateOfBirth, passengerAge, hasInsurance, travelClass, mealSelection, extraBags]);

  /**
   * Handles the flight search operation, simulates an API call, and navigates to results.
   * @param {object} searchParams - Parameters for the flight search.
   */
  const handleSearch = (searchParams) => {
    console.log("Initiating flight search with parameters:", searchParams);
    setIsLoading(true); // Set loading state

    // Simulate an API call delay
    setTimeout(() => {
      try {
        const generatedFlights = generateDummyFlights(searchParams);
        console.log("Flight search successful. Found", generatedFlights.length, "flights.");
        // Navigate to the flight results page, passing search results and params via state
        navigate('/flights', { state: { searchParams, searchResults: generatedFlights } });
      } catch (err) {
        console.error("Error during mock flight search:", err);
        // If an error occurs, you might want to show it on the current page or pass it to the results page
        // For now, we'll just log and stop loading.
      } finally {
        setIsLoading(false); // Clear loading state
      }
    }, 1000); // Simulate 1-second network delay
  };

  /**
   * Handles the form submission event.
   * Prevents default form submission, validates the form, and calls the onSearch callback if valid.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form submission
    if (validateForm()) { // Re-validate one last time before submission
      // Pass all search parameters, including advanced options, to the onSearch callback
      handleSearch({ origin, destination, departureDate, returnDate, passengers, dateOfBirth, passengerAge, hasInsurance, travelClass, mealSelection, extraBags });
      // Optionally, reset form fields after successful submission
      // setOrigin(''); setDestination(''); setDepartureDate(''); setReturnDate('');
      // setPassengers(1); setDateOfBirth('');
    } else {
      console.log("Form submission blocked due to validation errors:", errors);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-8 max-w-4xl mx-auto border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Find Your Next Adventure</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Origin and Destination Fields */}
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

        {/* Departure and Return Date Fields */}
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
              min={today} // Restrict departure date to today or future
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
              min={departureDate || today} // Return date cannot be before departure date or today
              disabled={!departureDate} // Disable if no departure date is selected
              aria-invalid={!!errors.returnDate}
              aria-describedby="returnDate-error"
            />
            {errors.returnDate && <p id="returnDate-error" className="text-red-600 text-xs italic mt-1">{errors.returnDate}</p>}
          </div>
        </div>

        {/* Passengers and Date of Birth Fields */}
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
              onChange={(e) => setPassengers(parseInt(e.target.value, 10) || 0)} // Ensure value is a number, default to 0 if NaN
              min="1" // Minimum of 1 passenger
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
                // Calculate age from DOB
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
              max={today} // Date of Birth cannot be in the future
              aria-invalid={!!errors.dateOfBirth}
              aria-describedby="dateOfBirth-error"
            />
            {errors.dateOfBirth && <p id="dateOfBirth-error" className="text-red-600 text-xs italic mt-1">{errors.dateOfBirth}</p>}
          </div>
        </div>

        {/* New Advanced Options Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Advanced Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Travel Class */}
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

            {/* Meal Selection */}
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

            {/* Extra Bags */}
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

            {/* Insurance Checkbox */}
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
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg tracking-wide transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75 ${
            isFormValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-75'
          }`}
          disabled={!isFormValid || isLoading} // Disable if form is invalid or loading
        >
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm;