import serverErrorsHandler from "./helper.js";
import User from "../models/user.js";
import AuthController from "./AuthController.js";
import bcrypt from "bcrypt";
/**
 * UserController Class
 * Handles user registration and login functionalities.
 */

/**
 * Validation function for user registration and login.
 * @param {Object} request - The incoming request object.
 * @returns {boolean} - True if both username and password are provided, otherwise false.
 */
const validate = (request) => {
    const { username, password } = request.body;
    return username && password;
};


export default class UserController {
    /**
     * Registers a new user.
     * @param {Object} request - The incoming request object containing user data.
     * @param {Object} response - The outgoing response object to send back to the client.
     */
    static async register(request, response) {
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

            const isExist = await User.findOne({ username: request.body.username });
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

            const user = await User.create({ username: request.body.username, password: request.body.password });
            const token = AuthController.createJWT(user);

            return response.status(200).json({
                "status": "success",
                "message": "You have registered successfully.",
                token,
                "data": [user]
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
    static async login(request, response) {
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

            const user = await User.findOne({ username: request.body.username });
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

            const token = AuthController.createJWT(user);
            return response.status(200).json({
                "status": "success",
                "message": "You've logged in successfully.",
                token,
                "data": [user]
            });

        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}
