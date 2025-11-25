const express = require('express');
const cors = require('cors');
const { calculateFinalPrice } = require('./utils/priceCalculator'); // Import the price calculation utility

// Initialize the Express application
const app = express();
// Define the port for the server to listen on. Defaults to 3001 if not specified in environment variables.
const PORT = process.env.PORT || 3001;

// --- Middleware Configuration ---

// Enable Cross-Origin Resource Sharing (CORS) for all routes.
// This allows the frontend application (running on a different origin) to make requests to this API.
app.use(cors());
// Enable JSON body parsing for incoming requests.
// This middleware parses incoming request bodies with JSON payloads and makes them available under `req.body`.
app.use(express.json());

// --- Routes ---

/**
 * GET /
 * A basic health check endpoint to confirm the backend server is running.
 */
app.get('/', (req, res) => {
  console.log('GET / request received.');
  res.status(200).send('Flight Booking Backend is running!');
});

/**
 * POST /api/book
 * Handles flight booking requests. This endpoint includes robust server-side validation
 * to prevent client-side bypass attacks and calculates the final price using the
 * `priceCalculator` utility.
 *
 * Request Body (req.body) expected structure:
 * {
 *   origin: string,
 *   destination: string,
 *   departureDate: string (YYYY-MM-DD),
 *   returnDate?: string (YYYY-MM-DD),
 *   passengers: number,
 *   selectedFlight: {
 *     id: string,
 *     price: number,
 *     type: 'Domestic' | 'International',
 *     // ... other flight details ...
 *   },
 *   extraBags?: number,
 *   mealSelection?: string,
 *   discountCode?: string,
 *   dateOfBirth?: string (YYYY-MM-DD)
 * }
 */
app.post('/api/book', (req, res) => {
  console.log('POST /api/book request received with body:', req.body);
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    selectedFlight,
    extraBags = 0, // Default to 0 if not provided
    mealSelection = 'none', // Default to 'none' if not provided
    discountCode,
    dateOfBirth,
  } = req.body;

  // --- Server-side Validation Logic ---
  // This array will collect all validation error messages.
  let errors = [];

  // Validate Origin
  if (!origin || typeof origin !== 'string' || origin.trim().length === 0) {
    errors.push('Invalid or missing origin. Origin must be a non-empty string.');
  }

  // Validate Destination
  if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
    errors.push('Invalid or missing destination. Destination must be a non-empty string.');
  }

  // Validate Departure Date format and presence
  if (!departureDate || !/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
    errors.push('Invalid or missing departure date format. Expected YYYY-MM-DD.');
  } else if (new Date(departureDate) < new Date(new Date().setHours(0, 0, 0, 0))) { // Check if departure date is in the past
    errors.push('Departure date cannot be in the past.');
  }

  // Validate Return Date if provided
  if (returnDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(returnDate)) {
      errors.push('Invalid return date format. Expected YYYY-MM-DD.');
    } else if (new Date(returnDate) < new Date(departureDate)) {
      errors.push('Return date cannot be before departure date.');
    }
  }

  // Validate Number of Passengers
  if (typeof passengers !== 'number' || !Number.isInteger(passengers) || passengers <= 0) {
    errors.push('Number of passengers must be a positive integer.');
  }

  // Validate Selected Flight details
  if (!selectedFlight || typeof selectedFlight !== 'object' || !selectedFlight.id) {
    errors.push('No flight selected for booking or selected flight details are incomplete.');
  } else {
    // Further validation for selected flight's critical properties
    if (typeof selectedFlight.price !== 'number' || selectedFlight.price <= 0) {
      errors.push('Selected flight has an invalid price. Price must be a positive number.');
    }
    if (typeof selectedFlight.type !== 'string' || !['Domestic', 'International'].includes(selectedFlight.type)) {
      errors.push('Selected flight has an invalid type. Must be "Domestic" or "International".');
    }
  }

  // Validate Extra Bags
  if (typeof extraBags !== 'number' || !Number.isInteger(extraBags) || extraBags < 0) {
    errors.push('Extra bags must be a non-negative integer.');
  }

  // Validate Meal Selection (assuming 'none', 'standard', 'premium' are valid)
  const validMealSelections = ['none', 'standard', 'premium'];
  if (mealSelection && !validMealSelections.includes(mealSelection)) {
      errors.push(`Invalid meal selection: "${mealSelection}". Valid options are ${validMealSelections.join(', ')}.`);
  }

  // Validate Discount Code (simple alphanumeric for now to prevent basic injection attempts)
  if (discountCode) {
    // Regex to allow alphanumeric characters, and specific safe symbols like hyphens.
    // This will reject SQL injection attempts.
    const discountCodePattern = /^[a-zA-Z0-9-]+$/;
    if (typeof discountCode !== 'string' || !discountCodePattern.test(discountCode)) {
      errors.push('Invalid discount code format. Only alphanumeric characters and hyphens are allowed.');
    }
  }

  // Validate Date of Birth if provided
  if (dateOfBirth) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      errors.push('Invalid date of birth format. Expected YYYY-MM-DD.');
    } else if (new Date(dateOfBirth) > new Date()) {
      errors.push('Date of Birth cannot be in the future.');
    }
  }

  // If any validation errors are found, send a 400 Bad Request response.
  if (errors.length > 0) {
    console.warn('Booking validation failed:', errors);
    return res.status(400).json({
      success: false,
      message: 'Booking request validation failed.',
      errors: errors
    });
  }

  // --- Price Calculation and Booking Simulation ---
  try {
    // Extract necessary details for price calculation
    const isInternational = selectedFlight.type === 'International';
    const baseFare = selectedFlight.price;

    const bookingDetailsForCalculation = {
      baseFare: baseFare,
      numberOfPassengers: passengers,
      isInternational: isInternational,
      extraBags: extraBags,
      mealSelection: mealSelection,
      discountCode: discountCode,
    };

    // Calculate the final price using the imported utility function
    const finalPrice = calculateFinalPrice(bookingDetailsForCalculation);

    // Simulate saving the booking to a database.
    // In a real application, this would involve database operations,
    // potentially user authentication, and transaction management.
    const bookingConfirmation = {
      bookingId: `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // Generate a unique booking ID
      flightDetails: { // Store essential flight details
        id: selectedFlight.id,
        airline: selectedFlight.airline,
        flightNumber: selectedFlight.flightNumber,
        origin: selectedFlight.origin,
        destination: selectedFlight.destination,
        departureDate: selectedFlight.departureDate,
        departureTime: selectedFlight.departureTime,
      },
      passengerCount: passengers,
      bookedExtraBags: extraBags,
      selectedMeal: mealSelection,
      appliedDiscountCode: discountCode,
      finalAmount: finalPrice,
      status: 'Confirmed', // Simulate a confirmed status
      bookingTimestamp: new Date().toISOString(),
      customerDetails: { // Placeholder for customer info if provided
        dateOfBirth: dateOfBirth,
        // ... other customer details would go here
      }
    };

    console.log('Flight booked successfully:', bookingConfirmation);
    // Send a success response with the booking confirmation details.
    res.status(200).json({
      success: true,
      message: 'Flight booked successfully!',
      booking: bookingConfirmation,
    });
  } catch (error) {
    // Catch any errors during price calculation or booking simulation
    console.error('Error during booking process:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error during booking.',
      error: error.message
    });
  }
});

// --- Server Initialization ---

// Start the Express server and listen for incoming requests on the specified PORT.
const server = app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server.');
});

module.exports = server;