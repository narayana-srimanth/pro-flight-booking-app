/**
 * @module PriceCalculatorUnitTests
 * @description
 * This test suite provides comprehensive unit tests for the `calculateFinalPrice` function
 * in `server/utils/priceCalculator.js`. The goal is to achieve 100% code coverage to
 * ensure robustness and effectiveness for mutation testing. Each test case verifies
 * specific aspects of the pricing logic, including base fare, taxes, fees, and discounts,
 * as well as edge cases and error handling.
 */
const { expect } = require('chai');
const { calculateFinalPrice } = require('../../server/utils/priceCalculator');

describe('Price Calculator Unit Tests', () => {

  // --- Basic Calculation Tests ---
  describe('Basic Price Calculation without Extras or Discounts', () => {
    it('should calculate the correct price for a basic domestic flight (1 passenger)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      // Expected: Base Fare (100) + Domestic Tax (12% of 100 = 12) = 112
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should calculate the correct price for a basic international flight (1 passenger)', () => {
      const details = {
        baseFare: 200,
        numberOfPassengers: 1,
        isInternational: true,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      // Expected: Base Fare (200) + International Tax (18% of 200 = 36) = 236
      const expectedPrice = 200 + (200 * 0.18);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should correctly factor in multiple passengers for a domestic flight', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 2,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      // Expected: (Base Fare * Passengers) (100*2=200) + Domestic Tax (12% of 200 = 24) = 224
      const baseWithPassengers = 100 * 2;
      const expectedPrice = baseWithPassengers + (baseWithPassengers * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply domestic tax if isInternational is explicitly false', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply domestic tax if isInternational is not a boolean (e.g., string)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: "maybe", // Invalid type, should default to domestic
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  });

  // --- Additional Fees Tests ---
  describe('Additional Fees (Baggage and Meals)', () => {
    it('should add correct fees for extra baggage (2 bags) using tiered logic', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 2,
        mealSelection: 'none',
        discountCode: null,
      };
      // Expected: (Base Fare + Tax) (100+12=112)
      // Baggage: Tier 1 (50) + Tier 2 (75) = 125
      // Total: 112 + 125 = 237
      const baseWithTax = 100 + (100 * 0.12);
      const expectedPrice = baseWithTax + 50 + 75; 
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should not add baggage fees for zero extra bags (boundary condition)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0, // No extra bags
        mealSelection: 'none',
        discountCode: null,
      };
      // Expected: Base Fare + Tax = 112 (no baggage fee)
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should add correct fees for standard meal selection', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'standard',
        discountCode: null,
      };
      // Expected: (Base Fare + Tax) (112) + Standard Meal (15) = 127
      const baseWithTax = 100 + (100 * 0.12);
      const expectedPrice = baseWithTax + 15;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should add correct fees for premium meal selection', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'premium',
        discountCode: null,
      };
      // Expected: (Base Fare + Tax) (112) + Premium Meal (30) = 142
      const baseWithTax = 100 + (100 * 0.12);
      const expectedPrice = baseWithTax + 30;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should default to no meal fee for invalid meal selection string', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'veg_special', // Invalid meal type
        discountCode: null,
      };
      // Expected: (Base Fare + Tax) (112) + No Meal Fee (0) = 112
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should default to no meal fee if mealSelection is undefined', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: undefined, // Undefined meal type
        discountCode: null,
      };
      // Expected: (Base Fare + Tax) (112) + No Meal Fee (0) = 112
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should default to no meal fee if mealSelection is an empty array', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: [], // Test with empty array
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should default to no meal fee if mealSelection is an empty object', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: {}, // Test with empty object
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  });

  // --- Discount Logic Tests ---
  describe('Discount Code Application', () => {
    it('should apply 10% discount for FLY2025 when under cap ($50)', () => {
      const details = {
        baseFare: 400, // Pre-tax total: 400. After domestic tax (12%): 448.
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'FLY2025',
      };
      const totalBeforeDiscount = 400 + (400 * 0.12); // 448
      const discountAmount = totalBeforeDiscount * 0.10; // 44.80
      // 44.80 is less than $50 cap.
      const expectedPrice = totalBeforeDiscount - discountAmount; // 448 - 44.80 = 403.20
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should cap FLY2025 discount at $50 when calculated discount is over $50', () => {
      const details = {
        baseFare: 600, // Pre-tax total: 600. After domestic tax (12%): 672.
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'FLY2025',
      };
      const totalBeforeDiscount = 600 + (600 * 0.12); // 672
      const calculatedDiscount = totalBeforeDiscount * 0.10; // 67.20
      // 67.20 is greater than $50 cap. Discount should be $50.
      const expectedPrice = totalBeforeDiscount - 50; // 672 - 50 = 622
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should cap FLY2025 discount at $50 even if total price is low (totalPrice < 100 condition)', () => {
      const details = {
        baseFare: 50,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'FLY2025',
      };
      const totalBeforeDiscount = 50 + (50 * 0.12); // 56
      // totalPrice (56) < 100 is true, so discountAmount should be MAX_DISCOUNT (50).
      const expectedPrice = totalBeforeDiscount - 50; // 56 - 50 = 6
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply FLY2025 discount with multiple passengers correctly', () => {
      const details = {
        baseFare: 200,
        numberOfPassengers: 2, // Pre-tax total: 400. After domestic tax (12%): 448.
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'FLY2025',
      };
      const totalBeforeDiscount = (200 * 2) + ((200 * 2) * 0.12); // 448
      const discountAmount = totalBeforeDiscount * 0.10; // 44.80
      // 44.80 is less than $50 cap.
      const expectedPrice = totalBeforeDiscount - discountAmount; // 448 - 44.80 = 403.20
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply flat $20 discount for "SUMMER20" discount code', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'SUMMER20',
      };
      // Expected: (Base Fare + Tax) (112) - Flat $20 = 92
      const totalBeforeDiscount = 100 + (100 * 0.12); // 112
      const expectedPrice = totalBeforeDiscount - 20;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply flat $20 discount for "SAVE20" discount code', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'SAVE20',
      };
      // Expected: (Base Fare + Tax) (112) - Flat $20 = 92
      const totalBeforeDiscount = 100 + (100 * 0.12); // 112
      const expectedPrice = totalBeforeDiscount - 20;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply flat $10 discount for PROMO codes longer than 10 characters', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'SUPERLONGPROMOCODE', // Length > 10 and includes 'PROMO'
      };
      // Expected: (Base Fare + Tax) (112) - Flat $10 = 102
      const totalBeforeDiscount = 100 + (100 * 0.12); // 112
      const expectedPrice = totalBeforeDiscount - 10;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply flat $10 discount for PROMO codes exactly 11 characters long', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'PROMOCODE_A', // Length 11, includes PROMO
      };
      const totalBeforeDiscount = 100 + (100 * 0.12); // 112
      const expectedPrice = totalBeforeDiscount - 10; // 102
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply discount for FLY2025 with leading/trailing spaces (trimmed)', () => {
      const details = {
        baseFare: 400,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: '  FLY2025  ', // With spaces
      };
      const totalBeforeDiscount = 400 + (400 * 0.12); // 448
      const discountAmount = totalBeforeDiscount * 0.10; // 44.8
      const expectedPrice = totalBeforeDiscount - discountAmount;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply discount for FLY2025 with leading/trailing spaces and mixed case (trimmed and uppercased)', () => {
      const details = {
        baseFare: 400,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: '  fly2025  ', // Mixed case with spaces
      };
      const totalBeforeDiscount = 400 + (400 * 0.12); // 448
      const discountAmount = totalBeforeDiscount * 0.10; // 44.8
      const expectedPrice = totalBeforeDiscount - discountAmount;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply no discount for an invalid discount code', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'INVALIDCODE',
      };
      // Expected: (Base Fare + Tax) (112) - No Discount (0) = 112
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply no discount when discountCode is null or undefined', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: undefined, // Test with undefined
      };
      // Expected: (Base Fare + Tax) (112) - No Discount (0) = 112
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply no discount when discountCode is an empty string', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: '', // Test with empty string
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should not apply PROMO discount if code is exactly 10 characters long', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'APROMOCODE', // Exactly 10 chars, contains PROMO
      };
      const expectedPrice = 100 + (100 * 0.12); // No discount applied
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should not apply PROMO discount if code is shorter than 10 characters', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'PROMO', // Shorter than 10 chars
      };
      const expectedPrice = 100 + (100 * 0.12); // No discount applied
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should not apply PROMO discount if code is longer than 10 chars but does not contain "PROMO"', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'VERYLONGCODE', // Longer than 10, no PROMO
      };
      const expectedPrice = 100 + (100 * 0.12); // No discount applied
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  });

  // --- Combined Scenario Tests ---
  describe('Combined Scenarios and Edge Cases', () => {
    it('should correctly calculate price with all fees and discounts combined', () => {
      const details = {
        baseFare: 500,
        numberOfPassengers: 2,
        isInternational: true,
        extraBags: 1,
        mealSelection: 'premium',
        discountCode: 'FLY2025', // Should be capped at $50
      };
      let price = 500 * 2; // Initial: 1000
      price += price * 0.18; // After International Tax: 1000 + 180 = 1180
      price += 1 * 50; // After Baggage Fee: 1180 + 50 = 1230
      
      // CORRECTED: Meal selection is per passenger as per "Expanded Meal Options" tests
      price += 30 * 2; // After Premium Meal Fee: 1230 + 60 = 1290
      
      // Discount: 10% of 1290 = 129, but capped at $50. So, deduct $50.
      price -= 50; // Final: 1290 - 50 = 1240
      
      expect(calculateFinalPrice(details)).to.equal(parseFloat(price.toFixed(2)));
    });

    it('should ensure the final price does not go below zero after discounts', () => {
      const details = {
        baseFare: 10,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: 'SUMMER20', // $20 flat discount
      };
      let price = 10 + (10 * 0.12); // Price after tax: 11.20
      price -= 20; // After discount: 11.20 - 20 = -8.80
      // Expected: Price should be capped at 0.
      expect(calculateFinalPrice(details)).to.equal(0);
    });
  });

  // --- Input Validation Tests ---
  describe('Input Validation Errors', () => {
    it('should throw error if baseFare is zero', () => {
      const details = {
        baseFare: 0, // Invalid input
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Base fare and number of passengers must be positive.');
    });

    it('should throw error if baseFare is negative', () => {
      const details = {
        baseFare: -50, // Invalid input
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Base fare and number of passengers must be positive.');
    });

    it('should throw error if numberOfPassengers is zero', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 0, // Invalid input
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Base fare and number of passengers must be positive.');
    });

    it('should throw error if numberOfPassengers is negative', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: -1, // Invalid input
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Base fare and number of passengers must be positive.');
    });

    it('should throw error if extraBags is negative', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: -1, // Invalid input
        mealSelection: 'none',
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Extra bags cannot be negative.');
    });

    // New tests to kill `isInternational` related mutants
    it('should apply domestic tax if isInternational is null (defaults to domestic)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: null, // Test null value
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply domestic tax if isInternational is undefined (defaults to domestic)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: undefined, // Test undefined value
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply domestic tax if isInternational is zero (defaults to domestic)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: 0, // Test zero (falsey) value
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply domestic tax if isInternational is 1 (defaults to domestic)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: 1, // Test truthy number value
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply domestic tax if isInternational is an empty array (defaults to domestic)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: [], // Test truthy empty array
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply domestic tax if isInternational is an empty object (defaults to domestic)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: {}, // Test truthy empty object
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
      };
      const expectedPrice = 100 + (100 * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should throw error if passengerAge is negative', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        passengerAge: -5, // Invalid input
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Passenger age must be a non-negative integer if provided.');
    });

    it('should throw error if passengerAge is not an integer', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        passengerAge: 25.5, // Invalid input
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Passenger age must be a non-negative integer if provided.');
    });

    it('should throw error if hasInsurance is not a boolean', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        hasInsurance: 'yes', // Invalid input
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('hasInsurance must be a boolean if provided.');
    });

    it('should throw error if travelClass is invalid', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        travelClass: 'economyplus', // Invalid input
        discountCode: null,
      };
      expect(() => calculateFinalPrice(details)).to.throw('Travel class must be one of economy, business, first.');
    });
  });

  // --- Travel Class Multipliers Tests ---
  describe('Travel Class Multipliers', () => {
    it('should apply no multiplier for economy class', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
      };
      // Expected: (Base Fare * 1.0) + Domestic Tax (12%) = 100 + 12 = 112
      const expectedPrice = 100 * 1.0 * 1.12;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply 1.8x multiplier for business class', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'business',
      };
      // Expected: (Base Fare * 1.8) + Domestic Tax (12%) = 180 + 21.6 = 201.6
      const expectedPrice = 100 * 1.8 * 1.12;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply 2.5x multiplier for first class', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'first',
      };
      // Expected: (Base Fare * 2.5) + Domestic Tax (12%) = 250 + 30 = 280
      const expectedPrice = 100 * 2.5 * 1.12;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should use economy class multiplier if travelClass is not provided (defaults)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        // travelClass is undefined, should default to 'economy'
      };
      const expectedPrice = 100 * 1.0 * 1.12;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  });

  // --- Insurance Costs Tests ---
  describe('Insurance Costs', () => {
    it('should add insurance cost if hasInsurance is true', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        hasInsurance: true,
      };
      // Expected: (Base Fare * 1.0) + Insurance (30) + Domestic Tax (12%) = (100 + 30) + (130 * 0.12) = 130 + 15.6 = 145.6
      const basePlusClass = 100 * 1.0;
      const basePlusClassPlusInsurance = basePlusClass + (30 * details.numberOfPassengers);
      const expectedPrice = basePlusClassPlusInsurance + (basePlusClassPlusInsurance * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should not add insurance cost if hasInsurance is false', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        hasInsurance: false,
      };
      // Expected: (Base Fare * 1.0) + Domestic Tax (12%) = 112
      const basePlusClass = 100 * 1.0;
      const expectedPrice = basePlusClass + (basePlusClass * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should not add insurance cost if hasInsurance is undefined', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        // hasInsurance is undefined
      };
      // Expected: (Base Fare * 1.0) + Domestic Tax (12%) = 112
      const basePlusClass = 100 * 1.0;
      const expectedPrice = basePlusClass + (basePlusClass * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should add insurance cost for multiple passengers if hasInsurance is true', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 2,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        hasInsurance: true,
      };
      // Expected: (Base Fare * 1.0 * Passengers) + Insurance (30 * Passengers) + Domestic Tax (12%)
      // (100 * 1 * 2) + (30 * 2) = 200 + 60 = 260
      // 260 + (260 * 0.12) = 260 + 31.2 = 291.2
      const basePlusClass = 100 * 1.0 * details.numberOfPassengers;
      const basePlusClassPlusInsurance = basePlusClass + (30 * details.numberOfPassengers);
      const expectedPrice = basePlusClassPlusInsurance + (basePlusClassPlusInsurance * 0.12);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  });

  // --- Age-based Discounts Tests ---
  describe('Age-based Discounts', () => {
    it('should apply 15% senior discount for passenger age 60 or more', () => {
      const details = {
        baseFare: 200,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        passengerAge: 65, // Senior
      };
      // Base: 200 * 1.0 (economy) = 200
      // Tax: 200 * 0.12 = 24. Total: 224
      // Discount: 224 * 0.15 = 33.6
      // Final: 224 - 33.6 = 190.4
      const basePlusClass = details.baseFare * 1.0;
      const totalBeforeAgeDiscount = basePlusClass + (basePlusClass * 0.12);
      const discountAmount = totalBeforeAgeDiscount * 0.15;
      const expectedPrice = totalBeforeAgeDiscount - discountAmount;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply 20% child discount for passenger age less than 12', () => {
      const details = {
        baseFare: 200,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        passengerAge: 10, // Child
      };
      // Base: 200 * 1.0 (economy) = 200
      // Tax: 200 * 0.12 = 24. Total: 224
      // Discount: 224 * 0.20 = 44.8
      // Final: 224 - 44.8 = 179.2
      const basePlusClass = details.baseFare * 1.0;
      const totalBeforeAgeDiscount = basePlusClass + (basePlusClass * 0.12);
      const discountAmount = totalBeforeAgeDiscount * 0.20;
      const expectedPrice = totalBeforeAgeDiscount - discountAmount;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply no age discount for a regular adult (age between 12 and 59)', () => {
      const details = {
        baseFare: 200,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        passengerAge: 30, // Adult
      };
      // Base: 200 * 1.0 (economy) = 200
      // Tax: 200 * 0.12 = 24. Total: 224
      // No age discount
      const expectedPrice = 200 * 1.0 * 1.12;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply no age discount if passengerAge is undefined', () => {
      const details = {
        baseFare: 200,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
        // passengerAge is undefined
      };
      const expectedPrice = 200 * 1.0 * 1.12;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  });

  // --- Expanded Meal Options Tests ---
  describe('Expanded Meal Options', () => {
    it('should add correct fees for deluxe meal selection', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'deluxe',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 = 100
      // Tax: 100 * 0.12 = 12. Total: 112
      // Deluxe Meal: 50 * 1 passenger = 50
      // Final: 112 + 50 = 162
      const basePlusClass = details.baseFare * 1.0;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 50 * details.numberOfPassengers;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply meal cost per passenger for standard meal', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 2,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'standard',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 * 2 = 200
      // Tax: 200 * 0.12 = 24. Total: 224
      // Standard Meal: 15 * 2 passengers = 30
      // Final: 224 + 30 = 254
      const basePlusClass = details.baseFare * 1.0 * details.numberOfPassengers;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 15 * details.numberOfPassengers;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should apply meal cost per passenger for premium meal', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 2,
        isInternational: false,
        extraBags: 0,
        mealSelection: 'premium',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 * 2 = 200
      // Tax: 200 * 0.12 = 24. Total: 224
      // Premium Meal: 30 * 2 passengers = 60
      // Final: 224 + 60 = 284
      const basePlusClass = details.baseFare * 1.0 * details.numberOfPassengers;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 30 * details.numberOfPassengers;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  }); // Closed Expanded Meal Options describe block

  // --- Tiered Baggage Fees Tests ---
  describe('Tiered Baggage Fees', () => {
    it('should charge Tier 1 fee for 1 extra bag', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 1,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 = 100
      // Tax: 100 * 0.12 = 12. Total: 112
      // Baggage: 50
      // Final: 112 + 50 = 162
      const basePlusClass = details.baseFare * 1.0;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 50;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should charge Tier 1 + Tier 2 fees for 2 extra bags', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 2,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 = 100
      // Tax: 100 * 0.12 = 12. Total: 112
      // Baggage: 50 (tier1) + 75 (tier2) = 125
      // Final: 112 + 125 = 237
      const basePlusClass = details.baseFare * 1.0;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 50 + 75;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should charge Tier 1 + Tier 2 + Tier 3 fees for 3 extra bags', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 3,
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 = 100
      // Tax: 100 * 0.12 = 12. Total: 112
      // Baggage: 50 (tier1) + 75 (tier2) + 100 (tier3) = 225
      // Final: 112 + 225 = 337
      const basePlusClass = details.baseFare * 1.0;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 50 + 75 + 100;
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should charge Tier 1 + Tier 2 + (N-2)*Tier 3 for N extra bags where N > 2', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 4, // 4 bags
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 = 100
      // Tax: 100 * 0.12 = 12. Total: 112
      // Baggage: 50 (tier1) + 75 (tier2) + 100 (tier3 for 3rd bag) + 100 (tier3 for 4th bag) = 325
      // Final: 112 + 325 = 437
      const basePlusClass = details.baseFare * 1.0;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 50 + 75 + (2 * 100);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });

    it('should correctly calculate fees for a very large number of extra bags (e.g., 10 bags)', () => {
      const details = {
        baseFare: 100,
        numberOfPassengers: 1,
        isInternational: false,
        extraBags: 10, // 10 bags
        mealSelection: 'none',
        discountCode: null,
        travelClass: 'economy',
      };
      // Base: 100 * 1.0 = 100
      // Tax: 100 * 0.12 = 12. Total: 112
      // Baggage: 50 (tier1) + 75 (tier2) + (10 - 2) * 100 (tier3 for remaining 8 bags)
      // Baggage: 50 + 75 + 8 * 100 = 125 + 800 = 925
      // Final: 112 + 925 = 1037
      const basePlusClass = details.baseFare * 1.0;
      const totalAfterTax = basePlusClass + (basePlusClass * 0.12);
      const expectedPrice = totalAfterTax + 50 + 75 + (8 * 100);
      expect(calculateFinalPrice(details)).to.equal(parseFloat(expectedPrice.toFixed(2)));
    });
  }); // Closed Tiered Baggage Fees describe block

}); // Closed Main describe block