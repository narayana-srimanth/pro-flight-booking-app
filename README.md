# Flight Booking Application

This is a full-stack Flight Booking Application built for a university software testing project, demonstrating "Client-side Bypass Testing" and "Mutation Testing".

## Project Structure

- `client/`: React (Vite) frontend with Tailwind CSS.
- `server/`: Node.js with Express backend.
- `tests/`: Contains bypass and unit tests.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **Testing Tools:** Mocha, Chai, Supertest (for Bypass Testing), Stryker (for Mutation Testing)

## Core Features

### Frontend (Client)
- **Flight Search & Booking UI:**
    - Form to select Origin, Destination, Date, and Number of Passengers.
    - List of dummy flights for selection.
    - **Crucial Client-Side Validation:**
        - Prevents negative passenger counts.
        - Prevents return date before departure date.
        - Prevents future date for "Date of Birth".
        - Disables "Book Now" until a flight is selected.

### Backend (Server)
- **Price Calculation Logic:**
    - Located in `server/utils/priceCalculator.js`.
    - Calculates final ticket price based on:
        - Base Fare * Number of Passengers.
        - Tax calculation (18% for International, 12% for Domestic).
        - Baggage Fees ($50 per extra bag).
        - Meal Selection Fees.
        - Discount Logic (e.g., 'FLY2025' for 10% off, max $50; 'SUMMER20' for $20 flat).
    - This logic is designed to be complex for mutation testing.
- **API Endpoint:**
    - `POST /api/book`: Receives booking details.
    - **Important Server-Side Validation:** Rejects invalid data, acting as a safeguard against client-side bypass attempts.

## How to Run the Application

### 1. Backend Setup and Start

Navigate to the `server` directory and install dependencies, then start the server:

```bash
cd flight-booking-app/server
npm install
npm start # Or node index.js
```
The server will run on `http://localhost:3001`.

### 2. Frontend Setup and Start

Navigate to the `client` directory and install dependencies, then start the development server:

```bash
cd flight-booking-app/client
npm install
npm run dev
```
The frontend application will typically open in your browser at `http://localhost:5173` (or similar).

## Testing

Navigate to the `tests` directory for all testing commands.

```bash
cd flight-booking-app/tests
```

### 1. Client-Side Bypass Testing

These tests demonstrate that even if client-side validations are bypassed, the server-side validations will catch malicious or invalid requests.

```bash
npm run test:bypass
```

This command runs Mocha tests located in `tests/bypass/*.test.js`. It sends malformed requests to the backend and asserts that the server responds with appropriate error codes (e.g., 400 Bad Request).

### 2. Mutation Testing

Mutation testing is performed on the `server/utils/priceCalculator.js` file to ensure the unit tests are robust.

```bash
npm run test:mutation
```

This command uses Stryker Mutator to introduce small changes (mutations) to the `priceCalculator.js` code and then runs the unit tests. A successful mutation test means the unit tests caught the mutant (killed it). An "undetected" mutant indicates a potential gap in your test suite.
An HTML report will be generated in `tests/mutation/report/index.html`.

### 3. Unit Testing for Price Calculator

These are the standard unit tests for the price calculation logic. They should achieve 100% code coverage.

```bash
npm run test:unit
```
