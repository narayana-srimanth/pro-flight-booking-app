function stryNS_9fa48() {
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
const express = require('express');
const cors = require('cors');
const {
  calculateFinalPrice
} = require('./utils/priceCalculator');
const app = express();
const PORT = stryMutAct_9fa48("2") ? process.env.PORT && 3001 : stryMutAct_9fa48("1") ? false : stryMutAct_9fa48("0") ? true : (stryCov_9fa48("0", "1", "2"), process.env.PORT || 3001);
app.use(cors());
app.use(express.json());

/**
 * GET /
 * A basic health check endpoint to confirm the backend server is running.
 */
app.get(stryMutAct_9fa48("3") ? "" : (stryCov_9fa48("3"), '/'), (req, res) => {
  if (stryMutAct_9fa48("4")) {
    {}
  } else {
    stryCov_9fa48("4");
    res.status(200).send(stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), 'Flight Booking Backend is running!'));
  }
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
app.post(stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), '/api/book'), (req, res) => {
  if (stryMutAct_9fa48("7")) {
    {}
  } else {
    stryCov_9fa48("7");
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      selectedFlight,
      extraBags = 0,
      mealSelection = stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), 'none'),
      discountCode,
      dateOfBirth
    } = req.body;
    let errors = stryMutAct_9fa48("9") ? ["Stryker was here"] : (stryCov_9fa48("9"), []);
    if (stryMutAct_9fa48("12") ? (!origin || typeof origin !== 'string') && origin.trim().length === 0 : stryMutAct_9fa48("11") ? false : stryMutAct_9fa48("10") ? true : (stryCov_9fa48("10", "11", "12"), (stryMutAct_9fa48("14") ? !origin && typeof origin !== 'string' : stryMutAct_9fa48("13") ? false : (stryCov_9fa48("13", "14"), (stryMutAct_9fa48("15") ? origin : (stryCov_9fa48("15"), !origin)) || (stryMutAct_9fa48("17") ? typeof origin === 'string' : stryMutAct_9fa48("16") ? false : (stryCov_9fa48("16", "17"), typeof origin !== (stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), 'string')))))) || (stryMutAct_9fa48("20") ? origin.trim().length !== 0 : stryMutAct_9fa48("19") ? false : (stryCov_9fa48("19", "20"), (stryMutAct_9fa48("21") ? origin.length : (stryCov_9fa48("21"), origin.trim().length)) === 0)))) {
      if (stryMutAct_9fa48("22")) {
        {}
      } else {
        stryCov_9fa48("22");
        errors.push(stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), 'Invalid or missing origin. Origin must be a non-empty string.'));
      }
    }
    if (stryMutAct_9fa48("26") ? (!destination || typeof destination !== 'string') && destination.trim().length === 0 : stryMutAct_9fa48("25") ? false : stryMutAct_9fa48("24") ? true : (stryCov_9fa48("24", "25", "26"), (stryMutAct_9fa48("28") ? !destination && typeof destination !== 'string' : stryMutAct_9fa48("27") ? false : (stryCov_9fa48("27", "28"), (stryMutAct_9fa48("29") ? destination : (stryCov_9fa48("29"), !destination)) || (stryMutAct_9fa48("31") ? typeof destination === 'string' : stryMutAct_9fa48("30") ? false : (stryCov_9fa48("30", "31"), typeof destination !== (stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), 'string')))))) || (stryMutAct_9fa48("34") ? destination.trim().length !== 0 : stryMutAct_9fa48("33") ? false : (stryCov_9fa48("33", "34"), (stryMutAct_9fa48("35") ? destination.length : (stryCov_9fa48("35"), destination.trim().length)) === 0)))) {
      if (stryMutAct_9fa48("36")) {
        {}
      } else {
        stryCov_9fa48("36");
        errors.push(stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), 'Invalid or missing destination. Destination must be a non-empty string.'));
      }
    }
    if (stryMutAct_9fa48("40") ? !departureDate && !/^\d{4}-\d{2}-\d{2}$/.test(departureDate) : stryMutAct_9fa48("39") ? false : stryMutAct_9fa48("38") ? true : (stryCov_9fa48("38", "39", "40"), (stryMutAct_9fa48("41") ? departureDate : (stryCov_9fa48("41"), !departureDate)) || (stryMutAct_9fa48("42") ? /^\d{4}-\d{2}-\d{2}$/.test(departureDate) : (stryCov_9fa48("42"), !(stryMutAct_9fa48("50") ? /^\d{4}-\d{2}-\D{2}$/ : stryMutAct_9fa48("49") ? /^\d{4}-\d{2}-\d$/ : stryMutAct_9fa48("48") ? /^\d{4}-\D{2}-\d{2}$/ : stryMutAct_9fa48("47") ? /^\d{4}-\d-\d{2}$/ : stryMutAct_9fa48("46") ? /^\D{4}-\d{2}-\d{2}$/ : stryMutAct_9fa48("45") ? /^\d-\d{2}-\d{2}$/ : stryMutAct_9fa48("44") ? /^\d{4}-\d{2}-\d{2}/ : stryMutAct_9fa48("43") ? /\d{4}-\d{2}-\d{2}$/ : (stryCov_9fa48("43", "44", "45", "46", "47", "48", "49", "50"), /^\d{4}-\d{2}-\d{2}$/)).test(departureDate))))) {
      if (stryMutAct_9fa48("51")) {
        {}
      } else {
        stryCov_9fa48("51");
        errors.push(stryMutAct_9fa48("52") ? "" : (stryCov_9fa48("52"), 'Invalid or missing departure date format. Expected YYYY-MM-DD.'));
      }
    } else if (stryMutAct_9fa48("56") ? new Date(departureDate) >= new Date(new Date().setHours(0, 0, 0, 0)) : stryMutAct_9fa48("55") ? new Date(departureDate) <= new Date(new Date().setHours(0, 0, 0, 0)) : stryMutAct_9fa48("54") ? false : stryMutAct_9fa48("53") ? true : (stryCov_9fa48("53", "54", "55", "56"), new Date(departureDate) < new Date(stryMutAct_9fa48("57") ? new Date().setMinutes(0, 0, 0, 0) : (stryCov_9fa48("57"), new Date().setHours(0, 0, 0, 0))))) {
      if (stryMutAct_9fa48("58")) {
        {}
      } else {
        stryCov_9fa48("58");
        errors.push(stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), 'Departure date cannot be in the past.'));
      }
    }
    if (stryMutAct_9fa48("61") ? false : stryMutAct_9fa48("60") ? true : (stryCov_9fa48("60", "61"), returnDate)) {
      if (stryMutAct_9fa48("62")) {
        {}
      } else {
        stryCov_9fa48("62");
        if (stryMutAct_9fa48("65") ? false : stryMutAct_9fa48("64") ? true : stryMutAct_9fa48("63") ? /^\d{4}-\d{2}-\d{2}$/.test(returnDate) : (stryCov_9fa48("63", "64", "65"), !(stryMutAct_9fa48("73") ? /^\d{4}-\d{2}-\D{2}$/ : stryMutAct_9fa48("72") ? /^\d{4}-\d{2}-\d$/ : stryMutAct_9fa48("71") ? /^\d{4}-\D{2}-\d{2}$/ : stryMutAct_9fa48("70") ? /^\d{4}-\d-\d{2}$/ : stryMutAct_9fa48("69") ? /^\D{4}-\d{2}-\d{2}$/ : stryMutAct_9fa48("68") ? /^\d-\d{2}-\d{2}$/ : stryMutAct_9fa48("67") ? /^\d{4}-\d{2}-\d{2}/ : stryMutAct_9fa48("66") ? /\d{4}-\d{2}-\d{2}$/ : (stryCov_9fa48("66", "67", "68", "69", "70", "71", "72", "73"), /^\d{4}-\d{2}-\d{2}$/)).test(returnDate))) {
          if (stryMutAct_9fa48("74")) {
            {}
          } else {
            stryCov_9fa48("74");
            errors.push(stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), 'Invalid return date format. Expected YYYY-MM-DD.'));
          }
        } else if (stryMutAct_9fa48("79") ? new Date(returnDate) >= new Date(departureDate) : stryMutAct_9fa48("78") ? new Date(returnDate) <= new Date(departureDate) : stryMutAct_9fa48("77") ? false : stryMutAct_9fa48("76") ? true : (stryCov_9fa48("76", "77", "78", "79"), new Date(returnDate) < new Date(departureDate))) {
          if (stryMutAct_9fa48("80")) {
            {}
          } else {
            stryCov_9fa48("80");
            errors.push(stryMutAct_9fa48("81") ? "" : (stryCov_9fa48("81"), 'Return date cannot be before departure date.'));
          }
        }
      }
    }
    if (stryMutAct_9fa48("84") ? (typeof passengers !== 'number' || !Number.isInteger(passengers)) && passengers <= 0 : stryMutAct_9fa48("83") ? false : stryMutAct_9fa48("82") ? true : (stryCov_9fa48("82", "83", "84"), (stryMutAct_9fa48("86") ? typeof passengers !== 'number' && !Number.isInteger(passengers) : stryMutAct_9fa48("85") ? false : (stryCov_9fa48("85", "86"), (stryMutAct_9fa48("88") ? typeof passengers === 'number' : stryMutAct_9fa48("87") ? false : (stryCov_9fa48("87", "88"), typeof passengers !== (stryMutAct_9fa48("89") ? "" : (stryCov_9fa48("89"), 'number')))) || (stryMutAct_9fa48("90") ? Number.isInteger(passengers) : (stryCov_9fa48("90"), !Number.isInteger(passengers))))) || (stryMutAct_9fa48("93") ? passengers > 0 : stryMutAct_9fa48("92") ? passengers < 0 : stryMutAct_9fa48("91") ? false : (stryCov_9fa48("91", "92", "93"), passengers <= 0)))) {
      if (stryMutAct_9fa48("94")) {
        {}
      } else {
        stryCov_9fa48("94");
        errors.push(stryMutAct_9fa48("95") ? "" : (stryCov_9fa48("95"), 'Number of passengers must be a positive integer.'));
      }
    }
    if (stryMutAct_9fa48("98") ? (!selectedFlight || typeof selectedFlight !== 'object') && !selectedFlight.id : stryMutAct_9fa48("97") ? false : stryMutAct_9fa48("96") ? true : (stryCov_9fa48("96", "97", "98"), (stryMutAct_9fa48("100") ? !selectedFlight && typeof selectedFlight !== 'object' : stryMutAct_9fa48("99") ? false : (stryCov_9fa48("99", "100"), (stryMutAct_9fa48("101") ? selectedFlight : (stryCov_9fa48("101"), !selectedFlight)) || (stryMutAct_9fa48("103") ? typeof selectedFlight === 'object' : stryMutAct_9fa48("102") ? false : (stryCov_9fa48("102", "103"), typeof selectedFlight !== (stryMutAct_9fa48("104") ? "" : (stryCov_9fa48("104"), 'object')))))) || (stryMutAct_9fa48("105") ? selectedFlight.id : (stryCov_9fa48("105"), !selectedFlight.id)))) {
      if (stryMutAct_9fa48("106")) {
        {}
      } else {
        stryCov_9fa48("106");
        errors.push(stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), 'No flight selected for booking or selected flight details are incomplete.'));
      }
    } else {
      if (stryMutAct_9fa48("108")) {
        {}
      } else {
        stryCov_9fa48("108");
        if (stryMutAct_9fa48("111") ? typeof selectedFlight.price !== 'number' && selectedFlight.price <= 0 : stryMutAct_9fa48("110") ? false : stryMutAct_9fa48("109") ? true : (stryCov_9fa48("109", "110", "111"), (stryMutAct_9fa48("113") ? typeof selectedFlight.price === 'number' : stryMutAct_9fa48("112") ? false : (stryCov_9fa48("112", "113"), typeof selectedFlight.price !== (stryMutAct_9fa48("114") ? "" : (stryCov_9fa48("114"), 'number')))) || (stryMutAct_9fa48("117") ? selectedFlight.price > 0 : stryMutAct_9fa48("116") ? selectedFlight.price < 0 : stryMutAct_9fa48("115") ? false : (stryCov_9fa48("115", "116", "117"), selectedFlight.price <= 0)))) {
          if (stryMutAct_9fa48("118")) {
            {}
          } else {
            stryCov_9fa48("118");
            errors.push(stryMutAct_9fa48("119") ? "" : (stryCov_9fa48("119"), 'Selected flight has an invalid price. Price must be a positive number.'));
          }
        }
        if (stryMutAct_9fa48("122") ? typeof selectedFlight.type !== 'string' && !['Domestic', 'International'].includes(selectedFlight.type) : stryMutAct_9fa48("121") ? false : stryMutAct_9fa48("120") ? true : (stryCov_9fa48("120", "121", "122"), (stryMutAct_9fa48("124") ? typeof selectedFlight.type === 'string' : stryMutAct_9fa48("123") ? false : (stryCov_9fa48("123", "124"), typeof selectedFlight.type !== (stryMutAct_9fa48("125") ? "" : (stryCov_9fa48("125"), 'string')))) || (stryMutAct_9fa48("126") ? ['Domestic', 'International'].includes(selectedFlight.type) : (stryCov_9fa48("126"), !(stryMutAct_9fa48("127") ? [] : (stryCov_9fa48("127"), [stryMutAct_9fa48("128") ? "" : (stryCov_9fa48("128"), 'Domestic'), stryMutAct_9fa48("129") ? "" : (stryCov_9fa48("129"), 'International')])).includes(selectedFlight.type))))) {
          if (stryMutAct_9fa48("130")) {
            {}
          } else {
            stryCov_9fa48("130");
            errors.push(stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), 'Selected flight has an invalid type. Must be "Domestic" or "International".'));
          }
        }
      }
    }
    if (stryMutAct_9fa48("134") ? (typeof extraBags !== 'number' || !Number.isInteger(extraBags)) && extraBags < 0 : stryMutAct_9fa48("133") ? false : stryMutAct_9fa48("132") ? true : (stryCov_9fa48("132", "133", "134"), (stryMutAct_9fa48("136") ? typeof extraBags !== 'number' && !Number.isInteger(extraBags) : stryMutAct_9fa48("135") ? false : (stryCov_9fa48("135", "136"), (stryMutAct_9fa48("138") ? typeof extraBags === 'number' : stryMutAct_9fa48("137") ? false : (stryCov_9fa48("137", "138"), typeof extraBags !== (stryMutAct_9fa48("139") ? "" : (stryCov_9fa48("139"), 'number')))) || (stryMutAct_9fa48("140") ? Number.isInteger(extraBags) : (stryCov_9fa48("140"), !Number.isInteger(extraBags))))) || (stryMutAct_9fa48("143") ? extraBags >= 0 : stryMutAct_9fa48("142") ? extraBags <= 0 : stryMutAct_9fa48("141") ? false : (stryCov_9fa48("141", "142", "143"), extraBags < 0)))) {
      if (stryMutAct_9fa48("144")) {
        {}
      } else {
        stryCov_9fa48("144");
        errors.push(stryMutAct_9fa48("145") ? "" : (stryCov_9fa48("145"), 'Extra bags must be a non-negative integer.'));
      }
    }
    const validMealSelections = stryMutAct_9fa48("146") ? [] : (stryCov_9fa48("146"), [stryMutAct_9fa48("147") ? "" : (stryCov_9fa48("147"), 'none'), stryMutAct_9fa48("148") ? "" : (stryCov_9fa48("148"), 'standard'), stryMutAct_9fa48("149") ? "" : (stryCov_9fa48("149"), 'premium')]);
    if (stryMutAct_9fa48("152") ? mealSelection || !validMealSelections.includes(mealSelection) : stryMutAct_9fa48("151") ? false : stryMutAct_9fa48("150") ? true : (stryCov_9fa48("150", "151", "152"), mealSelection && (stryMutAct_9fa48("153") ? validMealSelections.includes(mealSelection) : (stryCov_9fa48("153"), !validMealSelections.includes(mealSelection))))) {
      if (stryMutAct_9fa48("154")) {
        {}
      } else {
        stryCov_9fa48("154");
        errors.push(stryMutAct_9fa48("155") ? `` : (stryCov_9fa48("155"), `Invalid meal selection: "${mealSelection}". Valid options are ${validMealSelections.join(stryMutAct_9fa48("156") ? "" : (stryCov_9fa48("156"), ', '))}.`));
      }
    }
    if (stryMutAct_9fa48("158") ? false : stryMutAct_9fa48("157") ? true : (stryCov_9fa48("157", "158"), discountCode)) {
      if (stryMutAct_9fa48("159")) {
        {}
      } else {
        stryCov_9fa48("159");
        const discountCodePattern = stryMutAct_9fa48("163") ? /^[^a-zA-Z0-9-]+$/ : stryMutAct_9fa48("162") ? /^[a-zA-Z0-9-]$/ : stryMutAct_9fa48("161") ? /^[a-zA-Z0-9-]+/ : stryMutAct_9fa48("160") ? /[a-zA-Z0-9-]+$/ : (stryCov_9fa48("160", "161", "162", "163"), /^[a-zA-Z0-9-]+$/);
        if (stryMutAct_9fa48("166") ? typeof discountCode !== 'string' && !discountCodePattern.test(discountCode) : stryMutAct_9fa48("165") ? false : stryMutAct_9fa48("164") ? true : (stryCov_9fa48("164", "165", "166"), (stryMutAct_9fa48("168") ? typeof discountCode === 'string' : stryMutAct_9fa48("167") ? false : (stryCov_9fa48("167", "168"), typeof discountCode !== (stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), 'string')))) || (stryMutAct_9fa48("170") ? discountCodePattern.test(discountCode) : (stryCov_9fa48("170"), !discountCodePattern.test(discountCode))))) {
          if (stryMutAct_9fa48("171")) {
            {}
          } else {
            stryCov_9fa48("171");
            errors.push(stryMutAct_9fa48("172") ? "" : (stryCov_9fa48("172"), 'Invalid discount code format. Only alphanumeric characters and hyphens are allowed.'));
          }
        }
      }
    }
    if (stryMutAct_9fa48("174") ? false : stryMutAct_9fa48("173") ? true : (stryCov_9fa48("173", "174"), dateOfBirth)) {
      if (stryMutAct_9fa48("175")) {
        {}
      } else {
        stryCov_9fa48("175");
        if (stryMutAct_9fa48("178") ? false : stryMutAct_9fa48("177") ? true : stryMutAct_9fa48("176") ? /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) : (stryCov_9fa48("176", "177", "178"), !(stryMutAct_9fa48("186") ? /^\d{4}-\d{2}-\D{2}$/ : stryMutAct_9fa48("185") ? /^\d{4}-\d{2}-\d$/ : stryMutAct_9fa48("184") ? /^\d{4}-\D{2}-\d{2}$/ : stryMutAct_9fa48("183") ? /^\d{4}-\d-\d{2}$/ : stryMutAct_9fa48("182") ? /^\D{4}-\d{2}-\d{2}$/ : stryMutAct_9fa48("181") ? /^\d-\d{2}-\d{2}$/ : stryMutAct_9fa48("180") ? /^\d{4}-\d{2}-\d{2}/ : stryMutAct_9fa48("179") ? /\d{4}-\d{2}-\d{2}$/ : (stryCov_9fa48("179", "180", "181", "182", "183", "184", "185", "186"), /^\d{4}-\d{2}-\d{2}$/)).test(dateOfBirth))) {
          if (stryMutAct_9fa48("187")) {
            {}
          } else {
            stryCov_9fa48("187");
            errors.push(stryMutAct_9fa48("188") ? "" : (stryCov_9fa48("188"), 'Invalid date of birth format. Expected YYYY-MM-DD.'));
          }
        } else if (stryMutAct_9fa48("192") ? new Date(dateOfBirth) <= new Date() : stryMutAct_9fa48("191") ? new Date(dateOfBirth) >= new Date() : stryMutAct_9fa48("190") ? false : stryMutAct_9fa48("189") ? true : (stryCov_9fa48("189", "190", "191", "192"), new Date(dateOfBirth) > new Date())) {
          if (stryMutAct_9fa48("193")) {
            {}
          } else {
            stryCov_9fa48("193");
            errors.push(stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), 'Date of Birth cannot be in the future.'));
          }
        }
      }
    }
    if (stryMutAct_9fa48("198") ? errors.length <= 0 : stryMutAct_9fa48("197") ? errors.length >= 0 : stryMutAct_9fa48("196") ? false : stryMutAct_9fa48("195") ? true : (stryCov_9fa48("195", "196", "197", "198"), errors.length > 0)) {
      if (stryMutAct_9fa48("199")) {
        {}
      } else {
        stryCov_9fa48("199");
        return res.status(400).json(stryMutAct_9fa48("200") ? {} : (stryCov_9fa48("200"), {
          success: stryMutAct_9fa48("201") ? true : (stryCov_9fa48("201"), false),
          message: stryMutAct_9fa48("202") ? "" : (stryCov_9fa48("202"), 'Booking request validation failed.'),
          errors: errors
        }));
      }
    }
    try {
      if (stryMutAct_9fa48("203")) {
        {}
      } else {
        stryCov_9fa48("203");
        const isInternational = stryMutAct_9fa48("206") ? selectedFlight.type !== 'International' : stryMutAct_9fa48("205") ? false : stryMutAct_9fa48("204") ? true : (stryCov_9fa48("204", "205", "206"), selectedFlight.type === (stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), 'International')));
        const baseFare = selectedFlight.price;
        const bookingDetailsForCalculation = stryMutAct_9fa48("208") ? {} : (stryCov_9fa48("208"), {
          baseFare: baseFare,
          numberOfPassengers: passengers,
          isInternational: isInternational,
          extraBags: extraBags,
          mealSelection: mealSelection,
          discountCode: discountCode
        });
        const finalPrice = calculateFinalPrice(bookingDetailsForCalculation);
        const bookingConfirmation = stryMutAct_9fa48("209") ? {} : (stryCov_9fa48("209"), {
          bookingId: stryMutAct_9fa48("210") ? `` : (stryCov_9fa48("210"), `BK-${Date.now()}-${Math.floor(stryMutAct_9fa48("211") ? Math.random() / 10000 : (stryCov_9fa48("211"), Math.random() * 10000))}`),
          flightDetails: stryMutAct_9fa48("212") ? {} : (stryCov_9fa48("212"), {
            id: selectedFlight.id,
            airline: selectedFlight.airline,
            flightNumber: selectedFlight.flightNumber,
            origin: selectedFlight.origin,
            destination: selectedFlight.destination,
            departureDate: selectedFlight.departureDate,
            departureTime: selectedFlight.departureTime
          }),
          passengerCount: passengers,
          bookedExtraBags: extraBags,
          selectedMeal: mealSelection,
          appliedDiscountCode: discountCode,
          finalAmount: finalPrice,
          status: stryMutAct_9fa48("213") ? "" : (stryCov_9fa48("213"), 'Confirmed'),
          bookingTimestamp: new Date().toISOString(),
          customerDetails: stryMutAct_9fa48("214") ? {} : (stryCov_9fa48("214"), {
            dateOfBirth: dateOfBirth
          })
        });
        res.status(200).json(stryMutAct_9fa48("215") ? {} : (stryCov_9fa48("215"), {
          success: stryMutAct_9fa48("216") ? false : (stryCov_9fa48("216"), true),
          message: stryMutAct_9fa48("217") ? "" : (stryCov_9fa48("217"), 'Flight booked successfully!'),
          booking: bookingConfirmation
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("218")) {
        {}
      } else {
        stryCov_9fa48("218");
        res.status(500).json(stryMutAct_9fa48("219") ? {} : (stryCov_9fa48("219"), {
          success: stryMutAct_9fa48("220") ? true : (stryCov_9fa48("220"), false),
          message: stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), 'Internal server error during booking.'),
          error: error.message
        }));
      }
    }
  }
});
const server = app.listen(PORT, () => {});
module.exports = server;