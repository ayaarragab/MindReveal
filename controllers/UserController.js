import User from "../models/user.js";
import AuthController from "./AuthController.js";
import serverErrorsHandler from "./helper.js";
import bcrypt from "bcrypt";

// Validation function
const validate = (request) => {
    const { username, password } = request.body;
    return username && password; // Returns true if both fields exist, false otherwise
};

export default class UserController {
    // Register Method
    static async register(request, response) {
        try {
            // Validate input
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

            // Check if username already exists
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

            // Hash the password before storing
            const hashedPassword = await AuthController.hashPassword(request.body.password);

            // Create user
            const user = await User.create({ username: request.body.username, password: hashedPassword });
            const token = AuthController.createJWT(user);

            return response.status(200).json({
                "status": "success",
                "message": "You have registeres successfully.",
                token,
                "data": [user]
            });

        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    // Signin Method
    static async login(request, response) {
        try {
            // Validate input
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

            // Find user
            const user = await User.findOne({ username: request.body.username });
            
            if (!user) {
                return response.status(401).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 401,
                        "details": "Invalid credentials, please try again"
                        + "If you're new to the API, please register first!"
                    }
                });
            }

            // Compare passwords
            const isValid = bcrypt.compare(request.body.password, user.password);
            
            if (!isValid) {                
                return response.status(401).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 401,
                        "details": "Invalid credentials"
                    }
                });
            }

            // Generate JWT token
            const token = AuthController.createJWT(user);

            return response.status(200).json({
                "status": "success",
                "message": "You've logged in successfully",
                token,
                "data": [user]
            });

        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}
