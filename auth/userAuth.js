import User from "../models/user.js";
import { createTokens, verifyRToken } from "./jwtHandler.js";
import bcrypt from "bcrypt";
import serverErrorsHandler from "../utils/helper.js";
import { token } from "morgan";

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
async function findUserByUsername(username) {
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

        const isExist = await findUserByUsername(request.body.username);
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

        // Create a new user in the database
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

        // Create tokens after successful user creation
        const tokens = createTokens(newUser); // Use the `newUser` object here

        newUser.refreshToken = tokens.refreshToken;
        await newUser.save();

        return response.status(200).json({
            "status": "success",
            "message": "You have registered successfully.",
            tokens,
            "data": [newUser]
        });

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

        const user = await findUserByUsername(request.body.username);
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
            "data": [user]
        });

    } catch (error) {
        serverErrorsHandler(response, error);
    }
}

export async function getToken(request, response) {
    const { refreshToken } = request.body;
    if (!refreshToken) {
        return response.status(401).json({
            "status": "error",
            "message": "An error occurred.",
            "error": {
                "code": 402,
                "details": "You have to send the refresh token to gain access token"
            }
        });       
    }
    try {
        const user = await verifyRToken(refreshToken);
        
        if (user) {           
            request.user = user;
            const tokens = createTokens(user);
            
            return response.status(200).json({
                "status": "success",
                "message": "Access token generated successfully",
                ...tokens
            });
            } else {
            return response.status(400).json({
                "status": "error",
                "message": "An error occurred.",
                "error": {
                    "code": 400,
                    "details": "Invalid refresh token"
                }
            })            
        }
    } catch (error) {
        return response.status(400).json({
            "status": "error",
            "message": "An error occurred.",
            "error": {
                "code": 400,
                "details": "Invalid refresh token"
            }
        });
    }
}