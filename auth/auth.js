import User from "../models/user.js";
import Admin from "../models/admin.js";
import { createTokens } from "./jwtHandler.js";
import bcrypt from "bcrypt";
import serverErrorsHandler from "../utils/helper.js";

/**
 * Validation function for user registration and login.
 * @param {Object} request - The incoming request object.
 * @returns {boolean} - True if both username and password are provided, otherwise false.
 */
const validate = (request) => {    
    const { username, password } = request.body;
    return username && password;
};

/**
 * Checks if a user exists in the database by username.
 * @param {string} username - The username to search for.
 * @returns {Promise<Object|null>} - The user object if found, otherwise null.
 */
async function findUserByUsername(username, isAdmin) {
    if (isAdmin) {
        return await Admin.findOne({ username }).explain("executionStats").then(console.log);;
    }
    return await User.findOne({ username });
}

/**
 * Registers a new user.
 * @param {Object} request - The incoming request object containing user credentials.
 * @param {Object} response - The outgoing response object to send back to the client.
 */
export async function register(request, response) {
    try {
        const validateInput = validate(request);
        if (!validateInput) {
            return response.status(400).json({
                "status": "error",
                "message": "An error occurred.",
                "error": {
                    "code": 400,
                    "details": "username and password are required! One of them is missing."
                }
            });
        }
        const username = request.body.username;
        const isAdmin = username.includes('admin');
        const isExist = await findUserByUsername(username, isAdmin);
        if (isExist) {
            return response.status(400).json({
                "status": "error",
                "message": "An error occurred.",
                "error": {
                    "code": 400,
                    "details": "This username was used before."
                }
            });
        }
        if (isAdmin) {
            const newAdmin = await Admin.create({ username: request.body.username, password: request.body.password });
            if (!newAdmin) {
                return response.status(500).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 500,
                        "details": "Failed to create admin."
                    }
                });
        }
        const tokens = createTokens(newAdmin); // Use the `newUser` object here

        newAdmin.refresh_token = tokens.refreshToken;
        await newAdmin.save();

        return response.status(200).json({
            "status": "success",
            "message": "You have registered successfully.",
            tokens,
        });
        } else {
            const newUser = await User.create({ username: request.body.username, password: request.body.password });

            // Ensure the user object is populated properly (e.g., password hashing is handled)
            if (!newUser) {
                return response.status(500).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 500,
                        "details": "Failed to create user."
                    }
                });
            }
            const tokens = createTokens(newUser); // Use the `newUser` object here

            newUser.refreshToken = tokens.refreshToken;
            await newUser.save();
    
            return response.status(200).json({
                "status": "success",
                "message": "You have registered successfully.",
                tokens,
            });
        }

    } catch (error) {
        serverErrorsHandler(response, error);
    }
}

/**
 * Logs in an existing user.
 * @param {Object} request - The incoming request object containing user credentials.
 * @param {Object} response - The outgoing response object to send back to the client.
 */
export async function login(request, response) {
    try {        
        const validateInput = validate(request);
        if (!validateInput) {
            return response.status(400).json({
                "status": "error",
                "message": "An error occurred.",
                "error": {
                    "code": 400,
                    "details": "username and password are required! One of them is missing."
                }
            });
        }

        const username = request.body.username;
        const isAdmin = username.includes('admin');

        const user = await findUserByUsername(username, isAdmin);
        if (!user) {
            return response.status(401).json({
                "status": "error",
                "message": "An error occurred.",
                "error": {
                    "code": 401,
                    "details": "Invalid credentials, please try again. If you're new to the API, please register first!"
                }
            });
        }

        const isValid = await bcrypt.compare(request.body.password, user.password);
        if (!isValid) {
            return response.status(401).json({
                "status": "error",
                "message": "An error occurred.",
                "error": {
                    "code": 401,
                    "details": "Password is not correct."
                }
            });
        }

        const tokens = createTokens(user);
        user.refresh_token = tokens.refreshToken;
        await user.save();
        return response.status(200).json({
            "status": "success",
            "message": "You've logged in successfully.",
            ...tokens,
        });

    } catch (error) {
        serverErrorsHandler(response, error);
    }
}
