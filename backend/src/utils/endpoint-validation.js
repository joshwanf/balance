const { checkSchema } = require('express-validator');
const { handleValidationErrors } = require('./validation');

const isLoggedIn = (req, res, next) => {
    if (!req.user || req.throwErr) {
        const err = new Error();
        err.title = "User isn't logged in!";
        err.message = "Forbidden";
        err.status = 403;
        next(err);
    }
    next();
}

const prepareSubqStatement = () => {
    // Use prepared statements to handle SQLite vs PostgreSQL differences
    const schema = process.env.NODE_ENV === 'production' ? process.env.SCHEMA + '"."' : '';
    const subq = {
        get schema() { return schema },
        statement: function(subquery) { return this[subquery] }
    }
   return subq;
}

const allSpotsValidation = [
    checkSchema({
        page: {
            optional: true, isInt: { options: { min: 1 } }, toInt: true,
            errorMessage: "Page must be an integer",
        },
        size: {
            optional: true, isInt: { options: { gt: 1, lt: 20 } }, toInt: true,
            errorMessage: "Size must be between 1 and 20",
        },
        minLat: {
            optional: true, isFloat: { options: true }, toFloat: true,
            errorMessage: "Minimum latitude is invalid",
        },
        maxLat: {
            optional: true,
            isFloat: {
                errorMessage: "Maximum latitude is invalid",
                options: true
            },
            toFloat: true,
        },
        minLng: {
            optional: true,
            isFloat: {
                errorMessage: "Minimum longitude is invalid",
                options: true
            },
            toFloat: true,
        },
        maxLng: {
            optional: true,
            isFloat: {
                errorMessage: "Maximum latitude is invalid",
                options: true
            },
            toFloat: true,
        },
        minPrice: {
            optional: true,
            isFloat: {
                errorMessage: "Minimum price must be greater than or equal to 0",
                options: {
                    min: 0
                }
            },
            isDecimal: { errorMessage: "Min price must be a number" },
            toFloat: true,
        },
        maxPrice: {
            optional: true,
            isFloat: {
                errorMessage: "Maximum price must be greater than or equal to 0",
                options: {
                    min: 0
                }
            },
            // isDecimal: { errorMessage: "Max price must be a number", options: {min: 100 } },
            toFloat: true,
        }
    }),
    handleValidationErrors
];

const createSpotValidation = [
    checkSchema({
        address: { exists: true, errorMessage: "Street address is required" },
        city: { exists: true, errorMessage: "City is required" },
        state: { exists: true, errorMessage: "State is required" },
        country: { exists: true, errorMessage: "Countryis required" },
        lat: { isFloat: { options: { min: -90, max: 90 } }, errorMessage: "Latitude must be within -90 and 90" },
        lng: { isFloat: { options: { min: -180, max: 180 } }, errorMessage: "Longitude must be within -180 and 180" },
        name: { isLength: { options: { min: 1, max: 50 } }, errorMessage: "Name must be less than 50 characters" },
        description: { exists: true, errorMessage: "Description is required" },
        price: { isFloat: { options: { gt: 0 } }, errorMessage: "Price per day must be a positive number" },
    }),
    handleValidationErrors
];

const createReviewValidation = [
    checkSchema({
        review: { isLength: { options: { min: 1 } }, errorMessage: "Review text is required" },
        stars: { isInt: { options: { min: 1, max: 5 } }, errorMessage: "Stars must be an integer from 1 to 5" }
    }),
    handleValidationErrors
];

module.exports = {
    isLoggedIn,
    prepareSubqStatement,
    allSpotsValidation,
    createSpotValidation,
    createReviewValidation
}