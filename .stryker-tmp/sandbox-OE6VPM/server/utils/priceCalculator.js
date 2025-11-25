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
 */function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
function calculateFinalPrice(bookingDetails) {
  if (stryMutAct_9fa48("222")) {
    {}
  } else {
    stryCov_9fa48("222");
    const {
      baseFare,
      numberOfPassengers,
      isInternational,
      extraBags,
      mealSelection,
      discountCode,
      passengerAge,
      hasInsurance,
      travelClass = stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), 'economy')
    } = bookingDetails;
    if (stryMutAct_9fa48("226") ? baseFare <= 0 && numberOfPassengers <= 0 : stryMutAct_9fa48("225") ? false : stryMutAct_9fa48("224") ? true : (stryCov_9fa48("224", "225", "226"), (stryMutAct_9fa48("229") ? baseFare > 0 : stryMutAct_9fa48("228") ? baseFare < 0 : stryMutAct_9fa48("227") ? false : (stryCov_9fa48("227", "228", "229"), baseFare <= 0)) || (stryMutAct_9fa48("232") ? numberOfPassengers > 0 : stryMutAct_9fa48("231") ? numberOfPassengers < 0 : stryMutAct_9fa48("230") ? false : (stryCov_9fa48("230", "231", "232"), numberOfPassengers <= 0)))) {
      if (stryMutAct_9fa48("233")) {
        {}
      } else {
        stryCov_9fa48("233");
        throw new Error(stryMutAct_9fa48("234") ? "" : (stryCov_9fa48("234"), 'Base fare and number of passengers must be positive.'));
      }
    }
    if (stryMutAct_9fa48("238") ? extraBags >= 0 : stryMutAct_9fa48("237") ? extraBags <= 0 : stryMutAct_9fa48("236") ? false : stryMutAct_9fa48("235") ? true : (stryCov_9fa48("235", "236", "237", "238"), extraBags < 0)) {
      if (stryMutAct_9fa48("239")) {
        {}
      } else {
        stryCov_9fa48("239");
        throw new Error(stryMutAct_9fa48("240") ? "" : (stryCov_9fa48("240"), 'Extra bags cannot be negative.'));
      }
    }
    if (stryMutAct_9fa48("243") ? passengerAge !== undefined || typeof passengerAge !== 'number' || passengerAge < 0 || !Number.isInteger(passengerAge) : stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : (stryCov_9fa48("241", "242", "243"), (stryMutAct_9fa48("245") ? passengerAge === undefined : stryMutAct_9fa48("244") ? true : (stryCov_9fa48("244", "245"), passengerAge !== undefined)) && (stryMutAct_9fa48("247") ? (typeof passengerAge !== 'number' || passengerAge < 0) && !Number.isInteger(passengerAge) : stryMutAct_9fa48("246") ? true : (stryCov_9fa48("246", "247"), (stryMutAct_9fa48("249") ? typeof passengerAge !== 'number' && passengerAge < 0 : stryMutAct_9fa48("248") ? false : (stryCov_9fa48("248", "249"), (stryMutAct_9fa48("251") ? typeof passengerAge === 'number' : stryMutAct_9fa48("250") ? false : (stryCov_9fa48("250", "251"), typeof passengerAge !== (stryMutAct_9fa48("252") ? "" : (stryCov_9fa48("252"), 'number')))) || (stryMutAct_9fa48("255") ? passengerAge >= 0 : stryMutAct_9fa48("254") ? passengerAge <= 0 : stryMutAct_9fa48("253") ? false : (stryCov_9fa48("253", "254", "255"), passengerAge < 0)))) || (stryMutAct_9fa48("256") ? Number.isInteger(passengerAge) : (stryCov_9fa48("256"), !Number.isInteger(passengerAge))))))) {
      if (stryMutAct_9fa48("257")) {
        {}
      } else {
        stryCov_9fa48("257");
        throw new Error(stryMutAct_9fa48("258") ? "" : (stryCov_9fa48("258"), 'Passenger age must be a non-negative integer if provided.'));
      }
    }
    if (stryMutAct_9fa48("261") ? hasInsurance !== undefined || typeof hasInsurance !== 'boolean' : stryMutAct_9fa48("260") ? false : stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259", "260", "261"), (stryMutAct_9fa48("263") ? hasInsurance === undefined : stryMutAct_9fa48("262") ? true : (stryCov_9fa48("262", "263"), hasInsurance !== undefined)) && (stryMutAct_9fa48("265") ? typeof hasInsurance === 'boolean' : stryMutAct_9fa48("264") ? true : (stryCov_9fa48("264", "265"), typeof hasInsurance !== (stryMutAct_9fa48("266") ? "" : (stryCov_9fa48("266"), 'boolean')))))) {
      if (stryMutAct_9fa48("267")) {
        {}
      } else {
        stryCov_9fa48("267");
        throw new Error(stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'hasInsurance must be a boolean if provided.'));
      }
    }
    const validTravelClasses = stryMutAct_9fa48("269") ? [] : (stryCov_9fa48("269"), [stryMutAct_9fa48("270") ? "" : (stryCov_9fa48("270"), 'economy'), stryMutAct_9fa48("271") ? "" : (stryCov_9fa48("271"), 'business'), stryMutAct_9fa48("272") ? "" : (stryCov_9fa48("272"), 'first')]);
    if (stryMutAct_9fa48("275") ? false : stryMutAct_9fa48("274") ? true : stryMutAct_9fa48("273") ? validTravelClasses.includes(travelClass) : (stryCov_9fa48("273", "274", "275"), !validTravelClasses.includes(travelClass))) {
      if (stryMutAct_9fa48("276")) {
        {}
      } else {
        stryCov_9fa48("276");
        throw new Error(stryMutAct_9fa48("277") ? `` : (stryCov_9fa48("277"), `Travel class must be one of ${validTravelClasses.join(stryMutAct_9fa48("278") ? "" : (stryCov_9fa48("278"), ', '))}.`));
      }
    }
    let totalPrice = stryMutAct_9fa48("279") ? baseFare / numberOfPassengers : (stryCov_9fa48("279"), baseFare * numberOfPassengers);
    const CLASS_MULTIPLIERS = stryMutAct_9fa48("280") ? {} : (stryCov_9fa48("280"), {
      economy: 1.0,
      business: 1.8,
      first: 2.5
    });
    stryMutAct_9fa48("281") ? totalPrice /= CLASS_MULTIPLIERS[travelClass] : (stryCov_9fa48("281"), totalPrice *= CLASS_MULTIPLIERS[travelClass]);
    const INSURANCE_COST_PER_PASSENGER = 30;
    if (stryMutAct_9fa48("283") ? false : stryMutAct_9fa48("282") ? true : (stryCov_9fa48("282", "283"), hasInsurance)) {
      if (stryMutAct_9fa48("284")) {
        {}
      } else {
        stryCov_9fa48("284");
        stryMutAct_9fa48("285") ? totalPrice -= INSURANCE_COST_PER_PASSENGER * numberOfPassengers : (stryCov_9fa48("285"), totalPrice += stryMutAct_9fa48("286") ? INSURANCE_COST_PER_PASSENGER / numberOfPassengers : (stryCov_9fa48("286"), INSURANCE_COST_PER_PASSENGER * numberOfPassengers));
      }
    }
    let taxRate = 0;
    const INTERNATIONAL_TAX_RATE = 0.18;
    const DOMESTIC_TAX_RATE = 0.12;
    if (stryMutAct_9fa48("289") ? isInternational !== true : stryMutAct_9fa48("288") ? false : stryMutAct_9fa48("287") ? true : (stryCov_9fa48("287", "288", "289"), isInternational === (stryMutAct_9fa48("290") ? false : (stryCov_9fa48("290"), true)))) {
      if (stryMutAct_9fa48("291")) {
        {}
      } else {
        stryCov_9fa48("291");
        taxRate = INTERNATIONAL_TAX_RATE;
      }
    } else if (stryMutAct_9fa48("294") ? isInternational !== false : stryMutAct_9fa48("293") ? false : stryMutAct_9fa48("292") ? true : (stryCov_9fa48("292", "293", "294"), isInternational === (stryMutAct_9fa48("295") ? true : (stryCov_9fa48("295"), false)))) {
      if (stryMutAct_9fa48("296")) {
        {}
      } else {
        stryCov_9fa48("296");
        taxRate = DOMESTIC_TAX_RATE;
      }
    } else {
      if (stryMutAct_9fa48("297")) {
        {}
      } else {
        stryCov_9fa48("297");
        taxRate = DOMESTIC_TAX_RATE;
      }
    }
    stryMutAct_9fa48("298") ? totalPrice -= totalPrice * taxRate : (stryCov_9fa48("298"), totalPrice += stryMutAct_9fa48("299") ? totalPrice / taxRate : (stryCov_9fa48("299"), totalPrice * taxRate));
    if (stryMutAct_9fa48("302") ? passengerAge === undefined : stryMutAct_9fa48("301") ? false : stryMutAct_9fa48("300") ? true : (stryCov_9fa48("300", "301", "302"), passengerAge !== undefined)) {
      if (stryMutAct_9fa48("303")) {
        {}
      } else {
        stryCov_9fa48("303");
        const SENIOR_DISCOUNT_PERCENTAGE = 0.15;
        const CHILD_DISCOUNT_PERCENTAGE = 0.20;
        if (stryMutAct_9fa48("307") ? passengerAge < 60 : stryMutAct_9fa48("306") ? passengerAge > 60 : stryMutAct_9fa48("305") ? false : stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304", "305", "306", "307"), passengerAge >= 60)) {
          if (stryMutAct_9fa48("308")) {
            {}
          } else {
            stryCov_9fa48("308");
            const discountAmount = stryMutAct_9fa48("309") ? totalPrice / SENIOR_DISCOUNT_PERCENTAGE : (stryCov_9fa48("309"), totalPrice * SENIOR_DISCOUNT_PERCENTAGE);
            stryMutAct_9fa48("310") ? totalPrice += discountAmount : (stryCov_9fa48("310"), totalPrice -= discountAmount);
          }
        } else if (stryMutAct_9fa48("314") ? passengerAge >= 12 : stryMutAct_9fa48("313") ? passengerAge <= 12 : stryMutAct_9fa48("312") ? false : stryMutAct_9fa48("311") ? true : (stryCov_9fa48("311", "312", "313", "314"), passengerAge < 12)) {
          if (stryMutAct_9fa48("315")) {
            {}
          } else {
            stryCov_9fa48("315");
            const discountAmount = stryMutAct_9fa48("316") ? totalPrice / CHILD_DISCOUNT_PERCENTAGE : (stryCov_9fa48("316"), totalPrice * CHILD_DISCOUNT_PERCENTAGE);
            stryMutAct_9fa48("317") ? totalPrice += discountAmount : (stryCov_9fa48("317"), totalPrice -= discountAmount);
          }
        }
      }
    }
    const BAGGAGE_FEES_TIER1 = 50;
    const BAGGAGE_FEES_TIER2 = 75;
    const BAGGAGE_FEES_TIER3 = 100;
    if (stryMutAct_9fa48("321") ? extraBags <= 0 : stryMutAct_9fa48("320") ? extraBags >= 0 : stryMutAct_9fa48("319") ? false : stryMutAct_9fa48("318") ? true : (stryCov_9fa48("318", "319", "320", "321"), extraBags > 0)) {
      if (stryMutAct_9fa48("322")) {
        {}
      } else {
        stryCov_9fa48("322");
        let baggageCost = 0;
        if (stryMutAct_9fa48("325") ? extraBags !== 1 : stryMutAct_9fa48("324") ? false : stryMutAct_9fa48("323") ? true : (stryCov_9fa48("323", "324", "325"), extraBags === 1)) {
          if (stryMutAct_9fa48("326")) {
            {}
          } else {
            stryCov_9fa48("326");
            baggageCost = BAGGAGE_FEES_TIER1;
          }
        } else if (stryMutAct_9fa48("329") ? extraBags !== 2 : stryMutAct_9fa48("328") ? false : stryMutAct_9fa48("327") ? true : (stryCov_9fa48("327", "328", "329"), extraBags === 2)) {
          if (stryMutAct_9fa48("330")) {
            {}
          } else {
            stryCov_9fa48("330");
            baggageCost = stryMutAct_9fa48("331") ? BAGGAGE_FEES_TIER1 - BAGGAGE_FEES_TIER2 : (stryCov_9fa48("331"), BAGGAGE_FEES_TIER1 + BAGGAGE_FEES_TIER2);
          }
        } else {
          if (stryMutAct_9fa48("332")) {
            {}
          } else {
            stryCov_9fa48("332");
            baggageCost = stryMutAct_9fa48("333") ? BAGGAGE_FEES_TIER1 + BAGGAGE_FEES_TIER2 - (extraBags - 2) * BAGGAGE_FEES_TIER3 : (stryCov_9fa48("333"), (stryMutAct_9fa48("334") ? BAGGAGE_FEES_TIER1 - BAGGAGE_FEES_TIER2 : (stryCov_9fa48("334"), BAGGAGE_FEES_TIER1 + BAGGAGE_FEES_TIER2)) + (stryMutAct_9fa48("335") ? (extraBags - 2) / BAGGAGE_FEES_TIER3 : (stryCov_9fa48("335"), (stryMutAct_9fa48("336") ? extraBags + 2 : (stryCov_9fa48("336"), extraBags - 2)) * BAGGAGE_FEES_TIER3)));
          }
        }
        stryMutAct_9fa48("337") ? totalPrice -= baggageCost : (stryCov_9fa48("337"), totalPrice += baggageCost);
      }
    }
    const MEAL_FEES = stryMutAct_9fa48("338") ? {} : (stryCov_9fa48("338"), {
      none: 0,
      standard: 15,
      premium: 30,
      deluxe: 50
    });
    const actualMealSelection = (stryMutAct_9fa48("341") ? mealSelection || MEAL_FEES.hasOwnProperty(mealSelection) : stryMutAct_9fa48("340") ? false : stryMutAct_9fa48("339") ? true : (stryCov_9fa48("339", "340", "341"), mealSelection && MEAL_FEES.hasOwnProperty(mealSelection))) ? mealSelection : stryMutAct_9fa48("342") ? "" : (stryCov_9fa48("342"), 'none');
    stryMutAct_9fa48("343") ? totalPrice -= MEAL_FEES[actualMealSelection] * numberOfPassengers : (stryCov_9fa48("343"), totalPrice += stryMutAct_9fa48("344") ? MEAL_FEES[actualMealSelection] / numberOfPassengers : (stryCov_9fa48("344"), MEAL_FEES[actualMealSelection] * numberOfPassengers));
    if (stryMutAct_9fa48("347") ? discountCode || typeof discountCode === 'string' : stryMutAct_9fa48("346") ? false : stryMutAct_9fa48("345") ? true : (stryCov_9fa48("345", "346", "347"), discountCode && (stryMutAct_9fa48("349") ? typeof discountCode !== 'string' : stryMutAct_9fa48("348") ? true : (stryCov_9fa48("348", "349"), typeof discountCode === (stryMutAct_9fa48("350") ? "" : (stryCov_9fa48("350"), 'string')))))) {
      if (stryMutAct_9fa48("351")) {
        {}
      } else {
        stryCov_9fa48("351");
        const trimmedCode = stryMutAct_9fa48("353") ? discountCode.toUpperCase() : stryMutAct_9fa48("352") ? discountCode.trim().toLowerCase() : (stryCov_9fa48("352", "353"), discountCode.trim().toUpperCase());
        const FLY2025_DISCOUNT_PERCENTAGE = 0.10;
        const FLY2025_MAX_DISCOUNT = 50;
        const FLAT_DISCOUNT_AMOUNT = 20;
        const PROMO_DISCOUNT_AMOUNT = 10;
        if (stryMutAct_9fa48("356") ? trimmedCode === 'FLY2025' || numberOfPassengers >= 1 : stryMutAct_9fa48("355") ? false : stryMutAct_9fa48("354") ? true : (stryCov_9fa48("354", "355", "356"), (stryMutAct_9fa48("358") ? trimmedCode !== 'FLY2025' : stryMutAct_9fa48("357") ? true : (stryCov_9fa48("357", "358"), trimmedCode === (stryMutAct_9fa48("359") ? "" : (stryCov_9fa48("359"), 'FLY2025')))) && (stryMutAct_9fa48("362") ? numberOfPassengers < 1 : stryMutAct_9fa48("361") ? numberOfPassengers > 1 : stryMutAct_9fa48("360") ? true : (stryCov_9fa48("360", "361", "362"), numberOfPassengers >= 1)))) {
          if (stryMutAct_9fa48("363")) {
            {}
          } else {
            stryCov_9fa48("363");
            let discountAmount = stryMutAct_9fa48("364") ? totalPrice / FLY2025_DISCOUNT_PERCENTAGE : (stryCov_9fa48("364"), totalPrice * FLY2025_DISCOUNT_PERCENTAGE);
            if (stryMutAct_9fa48("367") ? discountAmount > FLY2025_MAX_DISCOUNT && totalPrice < 100 : stryMutAct_9fa48("366") ? false : stryMutAct_9fa48("365") ? true : (stryCov_9fa48("365", "366", "367"), (stryMutAct_9fa48("370") ? discountAmount <= FLY2025_MAX_DISCOUNT : stryMutAct_9fa48("369") ? discountAmount >= FLY2025_MAX_DISCOUNT : stryMutAct_9fa48("368") ? false : (stryCov_9fa48("368", "369", "370"), discountAmount > FLY2025_MAX_DISCOUNT)) || (stryMutAct_9fa48("373") ? totalPrice >= 100 : stryMutAct_9fa48("372") ? totalPrice <= 100 : stryMutAct_9fa48("371") ? false : (stryCov_9fa48("371", "372", "373"), totalPrice < 100)))) {
              if (stryMutAct_9fa48("374")) {
                {}
              } else {
                stryCov_9fa48("374");
                discountAmount = FLY2025_MAX_DISCOUNT;
              }
            }
            stryMutAct_9fa48("375") ? totalPrice += discountAmount : (stryCov_9fa48("375"), totalPrice -= discountAmount);
          }
        } else if (stryMutAct_9fa48("378") ? trimmedCode === 'SUMMER20' && trimmedCode === 'SAVE20' : stryMutAct_9fa48("377") ? false : stryMutAct_9fa48("376") ? true : (stryCov_9fa48("376", "377", "378"), (stryMutAct_9fa48("380") ? trimmedCode !== 'SUMMER20' : stryMutAct_9fa48("379") ? false : (stryCov_9fa48("379", "380"), trimmedCode === (stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), 'SUMMER20')))) || (stryMutAct_9fa48("383") ? trimmedCode !== 'SAVE20' : stryMutAct_9fa48("382") ? false : (stryCov_9fa48("382", "383"), trimmedCode === (stryMutAct_9fa48("384") ? "" : (stryCov_9fa48("384"), 'SAVE20')))))) {
          if (stryMutAct_9fa48("385")) {
            {}
          } else {
            stryCov_9fa48("385");
            stryMutAct_9fa48("386") ? totalPrice += FLAT_DISCOUNT_AMOUNT : (stryCov_9fa48("386"), totalPrice -= FLAT_DISCOUNT_AMOUNT);
          }
        } else if (stryMutAct_9fa48("389") ? trimmedCode.length > 10 || trimmedCode.includes('PROMO') : stryMutAct_9fa48("388") ? false : stryMutAct_9fa48("387") ? true : (stryCov_9fa48("387", "388", "389"), (stryMutAct_9fa48("392") ? trimmedCode.length <= 10 : stryMutAct_9fa48("391") ? trimmedCode.length >= 10 : stryMutAct_9fa48("390") ? true : (stryCov_9fa48("390", "391", "392"), trimmedCode.length > 10)) && trimmedCode.includes(stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), 'PROMO')))) {
          if (stryMutAct_9fa48("394")) {
            {}
          } else {
            stryCov_9fa48("394");
            stryMutAct_9fa48("395") ? totalPrice += PROMO_DISCOUNT_AMOUNT : (stryCov_9fa48("395"), totalPrice -= PROMO_DISCOUNT_AMOUNT);
          }
        }
      }
    }
    if (stryMutAct_9fa48("399") ? totalPrice >= 0 : stryMutAct_9fa48("398") ? totalPrice <= 0 : stryMutAct_9fa48("397") ? false : stryMutAct_9fa48("396") ? true : (stryCov_9fa48("396", "397", "398", "399"), totalPrice < 0)) {
      if (stryMutAct_9fa48("400")) {
        {}
      } else {
        stryCov_9fa48("400");
        totalPrice = 0;
      }
    }
    return parseFloat(totalPrice.toFixed(2));
  }
}
module.exports = stryMutAct_9fa48("401") ? {} : (stryCov_9fa48("401"), {
  calculateFinalPrice
});