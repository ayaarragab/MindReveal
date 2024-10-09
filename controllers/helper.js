/**
 * @file helper.js
 * @brief Error handling utility for the MindReveal API.
 *
 * This file defines the serverErrorsHandler function which handles server errors 
 * by logging the error and sending a standardized error response to the client.
 */

/**
 * @function serverErrorsHandler
 * @description Handles server errors and sends a standardized error response.
 *
 * This function takes the response object and an error as input, logs the error
 * to the console, and sends a JSON response with a status code of 500, indicating
 * an internal server error.
 *
 * @param {Object} response - The response object for sending the error response.
 * @param {Error} error - The error object that occurred during processing.
 * @returns {Object} The JSON response sent to the client.
 */
const serverErrorsHandler = (response, error) => {
    console.error(error);
    return response.status(500).json({
        "status": "error",
        "message": "An internal server error occurred.",
        "error": {
            "code": 500,
            "details": "Please try again later."
        }
    });
}

export default serverErrorsHandler;
