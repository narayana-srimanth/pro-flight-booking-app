// server/utils/priceCalculator.js

/**
 * @module PriceCalculator
 * @description
 * This module provides a robust function to calculate the final ticket price for a flight booking.
 * It incorporates various factors such as base fare, number of passengers, taxes (international/domestic),
 * additional fees for baggage and meal selections, and a complex discount logic.
 * The internal logic is intentionally made intricate to serve as a strong candidate for mutation testing,
 * ensuring comprehensive test coverage is required to "kill" all potential mutants.
 */

/**
 * Calculates the final ticket price based on a comprehensive set of booking details.
 *
 * @function calculateFinalPrice
 * @param {object} bookingDetails - An object containing all necessary details for price calculation.
 * @param {number} bookingDetails.baseFare - The fundamental cost of a single ticket before any additions. Must be a positive number.
 * @param {number} bookingDetails.numberOfPassengers - The total count of passengers for this booking. Must be a positive integer.
 * @param {boolean} bookingDetails.isInternational - A flag indicating if the flight is international (`true`) or domestic (`false`). This affects tax rates.
 * @param {number} bookingDetails.extraBags - The quantity of additional baggage items beyond the standard allowance. Must be a non-negative integer.
 * @param {string} bookingDetails.mealSelection - The type of meal chosen by the passenger(s). Expected values are 'standard', 'premium', 'deluxe', or 'none'. Invalid values will default to 'none'.
 * @param {string} [bookingDetails.discountCode] - An optional promotional code to apply discounts. Case-insensitive after trimming.
 * @param {number} [bookingDetails.passengerAge] - The age of the primary passenger. Used for age-based discounts. Must be a non-negative integer.
 * @param {boolean} [bookingDetails.hasInsurance] - A flag indicating if travel insurance is selected.
 * @param {string} [bookingDetails.travelClass] - The class of travel (e.g., 'economy', 'business', 'first'). Affects base fare multipliers.
 * @returns {number} The final calculated total price for the booking, rounded to two decimal places.
 * @throws {Error} If `baseFare`, `numberOfPassengers` are non-positive, or `extraBags` is negative, indicating invalid input.
 *
 * @example
 * const price = calculateFinalPrice({
 *   baseFare: 200,
 *   numberOfPassengers: 2,
 *   isInternational: true,
 *   extraBags: 1,
 *   mealSelection: 'premium',
 *   discountCode: 'FLY2025',
 *   passengerAge: 25,
 *   hasInsurance: true,
 *   travelClass: 'business'
 * }); // Returns the calculated final price.
 */
function calculateFinalPrice(bookingDetails) {
  // Destructure booking details for easier access
  const {
    baseFare,
    numberOfPassengers,
    isInternational,
    extraBags,
    mealSelection,
    discountCode,
    passengerAge,     // New
    hasInsurance,     // New
    travelClass = 'economy' // New, with default
  } = bookingDetails;

  // --- Input Validation ---
  // Ensure fundamental pricing components are valid.
  if (baseFare <= 0 || numberOfPassengers <= 0) {
    console.error(`Invalid input: baseFare=${baseFare}, numberOfPassengers=${numberOfPassengers}. Both must be positive.`);
    throw new Error('Base fare and number of passengers must be positive.');
  }
  // Ensure extra baggage count is valid.
  if (extraBags < 0) {
    console.error(`Invalid input: extraBags=${extraBags}. Cannot be negative.`);
    throw new Error('Extra bags cannot be negative.');
  }

  // Validate passengerAge if provided
  if (passengerAge !== undefined && (typeof passengerAge !== 'number' || passengerAge < 0 || !Number.isInteger(passengerAge))) {
    console.error(`Invalid input: passengerAge=${passengerAge}. Must be a non-negative integer if provided.`);
    throw new Error('Passenger age must be a non-negative integer if provided.');
  }

  // Validate hasInsurance if provided
  if (hasInsurance !== undefined && typeof hasInsurance !== 'boolean') {
    console.error(`Invalid input: hasInsurance=${hasInsurance}. Must be a boolean if provided.`);
    throw new Error('hasInsurance must be a boolean if provided.');
  }

  // Validate travelClass
  const validTravelClasses = ['economy', 'business', 'first'];
  if (!validTravelClasses.includes(travelClass)) {
    console.error(`Invalid input: travelClass=${travelClass}. Must be one of ${validTravelClasses.join(', ')}.`);
    throw new Error(`Travel class must be one of ${validTravelClasses.join(', ')}.`);
  }

  // --- Core Price Calculation ---
  // Start with the base cost multiplied by the number of passengers.
  let totalPrice = baseFare * numberOfPassengers;

  // Apply travel class multipliers
  const CLASS_MULTIPLIERS = {
    economy: 1.0,
    business: 1.8,
    first: 2.5,
  };
  totalPrice *= CLASS_MULTIPLIERS[travelClass];

  // Add insurance cost if selected
  const INSURANCE_COST_PER_PASSENGER = 30;
  if (hasInsurance) {
    totalPrice += INSURANCE_COST_PER_PASSENGER * numberOfPassengers;
  }

  let taxRate = 0; // Initialize tax rate

  // --- Tax Calculation Logic ---
  // Define tax rates as constants for clarity and easy modification.
  const INTERNATIONAL_TAX_RATE = 0.18; // 18% tax for international flights
  const DOMESTIC_TAX_RATE = 0.12;    // 12% tax for domestic flights

  // Determine the applicable tax rate based on flight type.
  // Explicit boolean checks are used here for robust mutation testing.
  if (isInternational === true) {
    taxRate = INTERNATIONAL_TAX_RATE;
  } else if (isInternational === false) {
    taxRate = DOMESTIC_TAX_RATE;
  } else {
    // If 'isInternational' is not explicitly boolean (e.g., undefined, null, or other type),
    // default to domestic tax rate for safety and consistency.
    console.warn(`'isInternational' flag is not a boolean (${isInternational}). Defaulting to domestic tax rate.`);
    taxRate = DOMESTIC_TAX_RATE;
  }
  // Apply the calculated tax to the current total price.
  totalPrice += totalPrice * taxRate;

  // --- Age-based Discount Logic ---
  // Apply a discount if passengerAge is provided and meets certain criteria
  if (passengerAge !== undefined) {
    const SENIOR_DISCOUNT_PERCENTAGE = 0.15; // 15% discount for seniors (60+)
    const CHILD_DISCOUNT_PERCENTAGE = 0.20;  // 20% discount for children (under 12)

    if (passengerAge >= 60) {
      const discountAmount = totalPrice * SENIOR_DISCOUNT_PERCENTAGE;
      totalPrice -= discountAmount;
      console.log(`Senior discount applied: -$${discountAmount.toFixed(2)}`);
    } else if (passengerAge < 12) {
      const discountAmount = totalPrice * CHILD_DISCOUNT_PERCENTAGE;
      totalPrice -= discountAmount;
      console.log(`Child discount applied: -$${discountAmount.toFixed(2)}`);
    }
  }

  // --- Baggage Fees Calculation ---
  const BAGGAGE_FEES_TIER1 = 50;  // 1st extra bag
  const BAGGAGE_FEES_TIER2 = 75;  // 2nd extra bag
  const BAGGAGE_FEES_TIER3 = 100; // 3rd+ extra bag

  if (extraBags > 0) {
    let baggageCost = 0;
    if (extraBags === 1) {
      baggageCost = BAGGAGE_FEES_TIER1;
    } else if (extraBags === 2) {
      baggageCost = BAGGAGE_FEES_TIER1 + BAGGAGE_FEES_TIER2;
    } else { // 3 or more
      baggageCost = BAGGAGE_FEES_TIER1 + BAGGAGE_FEES_TIER2 + (extraBags - 2) * BAGGAGE_FEES_TIER3;
    }
    totalPrice += baggageCost;
  }

  // --- Meal Selection Fees Calculation ---
  // Define meal prices as a map for easy lookup.
  const MEAL_FEES = {
    none: 0,      // No cost for no meal
    standard: 15, // Cost for a standard meal
    premium: 30,  // Cost for a premium meal
    deluxe: 50,   // Cost for a deluxe meal
  };

  // Validate meal selection and apply the corresponding fee.
  // Ensure mealSelection is a valid key, default to 'none' if invalid or not provided,
  // preventing potential errors from accessing non-existent properties.
  const actualMealSelection = (mealSelection && MEAL_FEES.hasOwnProperty(mealSelection))
    ? mealSelection
    : 'none';
  totalPrice += MEAL_FEES[actualMealSelection] * numberOfPassengers; // Apply meal cost per passenger

  // --- Discount Logic ---
  // Apply discounts only if a discount code is provided and is a string.
  if (discountCode && typeof discountCode === 'string') {
    const trimmedCode = discountCode.trim().toUpperCase(); // Trim whitespace and convert to uppercase for case-insensitivity

    const FLY2025_DISCOUNT_PERCENTAGE = 0.10; // 10%
    const FLY2025_MAX_DISCOUNT = 50;         // Max $50 discount for FLY2025
    const FLAT_DISCOUNT_AMOUNT = 20;         // Flat $20 for SUMMER20/SAVE20
    const PROMO_DISCOUNT_AMOUNT = 10;        // Flat $10 for longer PROMO codes

    // Conditional discount application based on the trimmed code.
    if (trimmedCode === 'FLY2025' && numberOfPassengers >= 1) { // Example of complex condition for mutation
      let discountAmount = totalPrice * FLY2025_DISCOUNT_PERCENTAGE; // Calculate 10% discount
      // Cap the discount at a maximum amount or if the total price is very low (another complex condition).
      if (discountAmount > FLY2025_MAX_DISCOUNT || totalPrice < 100) {
        discountAmount = FLY2025_MAX_DISCOUNT;
      }
      totalPrice -= discountAmount;
      console.log(`Discount 'FLY2025' applied: -$${discountAmount.toFixed(2)}`);
    } else if (trimmedCode === 'SUMMER20' || trimmedCode === 'SAVE20') { // Multiple codes for same discount
      totalPrice -= FLAT_DISCOUNT_AMOUNT;
      console.log(`Discount '${trimmedCode}' applied: -$${FLAT_DISCOUNT_AMOUNT.toFixed(2)}`);
    } else if (trimmedCode.length > 10 && trimmedCode.includes('PROMO')) { // Length and keyword check
      totalPrice -= PROMO_DISCOUNT_AMOUNT;
      console.log(`Discount 'PROMO' applied: -$${PROMO_DISCOUNT_AMOUNT.toFixed(2)}`);
    } else {
      console.log(`Discount code '${discountCode}' is valid but no matching discount rules found.`);
    }
  }

  // --- Final Adjustments ---
  // Ensure the total price never drops below zero, even after significant discounts.
  if (totalPrice < 0) {
    console.warn(`Calculated price became negative (${totalPrice}). Capping at 0.`);
    totalPrice = 0;
  }

  // Round the final price to two decimal places to represent currency accurately.
  return parseFloat(totalPrice.toFixed(2));
}

// Export the function for use in other modules.
module.exports = {
  calculateFinalPrice,
};