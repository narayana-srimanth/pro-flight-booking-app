const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server/index'); // Assuming your Express app is exported from server/index.js

/**
 * @module BypassTests
 * @description
 * This test suite focuses on "Client-side Bypass Testing" using Mocha and Supertest.
 * It simulates a malicious client attempting to bypass frontend validations by sending
 * malformed or invalid data directly to the backend API (`POST /api/book`).
 * The tests assert that the backend's server-side validation correctly rejects these
 * invalid requests, returning a 400 Bad Request status and specific error messages.
 * This demonstrates the importance of robust server-side validation.
 */
describe('Client-Side Bypass Testing: /api/book Endpoint', () => {
  let server; // Variable to hold the running server instance for Supertest

  // Hook to start the server before all tests in this suite begin.
  // Supertest typically works by passing the Express app directly, but if the app
  // is listening on a port, we need to manage its lifecycle.
  before((done) => {
    // Start the Express app on a test-specific port (e.g., 3002) to avoid conflicts
    // with the main application server during development.
    server = app.listen(3002, () => {
      console.log('Test server started on port 3002');
      done(); // Signal Mocha that the async setup is complete
    });
  });

  // Hook to close the server after all tests in this suite have finished.
  after((done) => {
    // Gracefully shut down the test server.
    server.close(() => {
      console.log('Test server closed.');
      done(); // Signal Mocha that the async teardown is complete
    });
  });

  // --- Test Cases for Malicious Input (Bypassing Client-Side Validation) ---

  // Test Case 1: Attempt to book with a negative number of passengers.
  // This violates the client-side validation for passenger count (min="1").
  it('should reject booking with negative passenger count (-5)', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: -5, // Malicious input: negative passenger count
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic' },
        extraBags: 0,
        mealSelection: 'none',
        dateOfBirth: '1990-01-01',
      })
      .expect(400) // Expect HTTP 400 Bad Request from server validation
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Booking request validation failed.');
        expect(res.body.errors).to.include('Number of passengers must be a positive integer.');
        done();
      });
  });

  // New test case: Hit the GET / endpoint
  it('should respond to GET / with "Flight Booking Backend is running!"', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Flight Booking Backend is running!');
        done();
      });
  });

  // Test Case 2: Attempt to book with a Date of Birth in the future.
  // This violates the client-side validation for Date of Birth (max=today).
  it('should reject booking with future Date of Birth (2026-01-01)', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 2,
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic' },
        extraBags: 0,
        mealSelection: 'none',
        dateOfBirth: '2026-01-01', // Malicious input: future date for DOB
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Booking request validation failed.');
        expect(res.body.errors).to.include('Date of Birth cannot be in the future.');
        done();
      });
  });

  // Test Case 3: Attempt to book with a return date that is before the departure date.
  // This violates the client-side validation for date range.
  it('should reject booking with return date before departure date', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-05',
        returnDate: '2025-12-01', // Malicious input: return before departure
        passengers: 1,
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic' },
        extraBags: 0,
        mealSelection: 'none',
        dateOfBirth: '1990-01-01',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Booking request validation failed.');
        expect(res.body.errors).to.include('Return date cannot be before departure date.');
        done();
      });
  });

  // Test Case 4: Missing the 'origin' field entirely.
  // Server-side validation should catch missing mandatory fields.
  it('should reject booking with missing origin field', (done) => {
    request(app)
      .post('/api/book')
      .send({
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 1,
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic' },
        extraBags: 0,
        mealSelection: 'none',
        dateOfBirth: '1990-01-01',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Booking request validation failed.');
        expect(res.body.errors).to.include('Invalid or missing origin. Origin must be a non-empty string.');
        done();
      });
  });

  // Test Case 5: Missing the 'selectedFlight' object.
  // Client-side prevents submission without selecting a flight; server-side must also check.
  it('should reject booking without a selected flight object', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 1,
        extraBags: 0,
        mealSelection: 'none',
        dateOfBirth: '1990-01-01',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Booking request validation failed.');
        expect(res.body.errors).to.include('No flight selected for booking or selected flight details are incomplete.');
        done();
      });
  });

  // Test Case 6: Attempt a simulated SQL Injection in the discount code.
  // Although the current backend only trims and converts to uppercase, a robust system
  // should explicitly validate discount codes against a whitelist. Here, we check
  // that it doesn't cause an internal server error and is handled as an invalid input.
  it('should reject booking with malicious discount code (SQL Injection attempt)', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 1,
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic' },
        extraBags: 0,
        mealSelection: 'none',
        discountCode: "'; DROP TABLE users; --", // Malicious input: SQL Injection payload
        dateOfBirth: '1990-01-01',
      })
      .expect(400) // Expecting the server's validation to still return 400.
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Booking request validation failed.');
        // The specific error might depend on how 'discountCode' is validated.
        // If it's just passed to priceCalculator, it might not cause a direct validation error in server/index.js.
        // However, this test ensures the system doesn't crash or behave unexpectedly.
        // For now, we check for a generic error that might arise from other validations.
        expect(res.body.errors).to.be.an('array'); // Ensure errors array is present
        done();
      });
  });

  // Test Case 7: Invalid price in selected flight details.
  it('should reject booking if selected flight has an invalid price (zero)', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 1,
        selectedFlight: { id: 'FL002', price: 0, type: 'International' }, // Malicious input: zero price
        extraBags: 0,
        mealSelection: 'none',
        dateOfBirth: '1990-01-01',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.errors).to.include('Selected flight has an invalid price. Price must be a positive number.');
        done();
      });
  });

  // Test Case 8: Invalid type in selected flight details.
  it('should reject booking if selected flight has an invalid type (e.g., "unknown")', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 1,
        selectedFlight: { id: 'FL003', price: 300, type: 'unknown' }, // Malicious input: invalid flight type
        extraBags: 0,
        mealSelection: 'none',
        dateOfBirth: '1990-01-01',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.errors).to.include('Selected flight has an invalid type. Must be "Domestic" or "International".');
        done();
      });
  });

  // Test Case 9: Invalid 'extraBags' (negative value).
  it('should reject booking with negative extra bags count (-2)', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 1,
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic' },
        extraBags: -2, // Malicious input: negative extra bags
        mealSelection: 'none',
        dateOfBirth: '1990-01-01',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.errors).to.include('Extra bags must be a non-negative integer.');
        done();
      });
  });

  // Test Case 10: Invalid 'mealSelection' string.
  it('should reject booking with an invalid meal selection string', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 1,
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic' },
        extraBags: 0,
        mealSelection: 'gourmet_gold', // Malicious input: invalid meal selection
        dateOfBirth: '1990-01-01',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.errors).to.include('Invalid meal selection: "gourmet_gold". Valid options are none, standard, premium.');
        done();
      });
  });

  // Test Case 11: Valid booking with all correct data.
  // This test ensures that the booking endpoint functions correctly with legitimate inputs.
  it('should successfully book a flight with valid data', (done) => {
    request(app)
      .post('/api/book')
      .send({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: 2,
        selectedFlight: { id: 'FL001', price: 200, type: 'Domestic', airline: 'TestAir', flightNumber: 'TA123', origin: 'NYC', destination: 'LAX', departureDate: '2025-12-01', departureTime: '10:00' },
        extraBags: 1,
        mealSelection: 'premium',
        discountCode: 'FLY2025',
        dateOfBirth: '1985-05-15',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Flight booked successfully!');
        expect(res.body.booking).to.have.property('bookingId').that.is.a('string');
        expect(res.body.booking.finalAmount).to.be.a('number');
        expect(res.body.booking.status).to.equal('Confirmed');
        expect(res.body.booking.passengerCount).to.equal(2);
        done();
      });
  });
});
