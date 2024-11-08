/**
 * @file AuthMiddlewares.js
 * @brief Middleware for authorization in the MindReveal API.
 *
 * This file defines the AuthMiddlewares class which contains middleware for
 * checking user authorization based on JWT tokens in request headers.
 * 
 * The middleware ensures that requests to protected routes are authenticated
 * before proceeding to the next middleware or route handler.
 */

import serverErrorsHandler from "../controllers/helper.js";
import AuthController from "../controllers/AuthController.js";

export default class AuthMiddlewares {
    /**
     * @function isAuthorized
     * @description Middleware to check if the user is authorized to access protected routes.
     * 
     * This method checks for the presence of a JWT in the Authorization header,
     * verifies the token, and adds the user information to the request object
     * if the token is valid. If the token is missing or invalid, it sends an
     * appropriate error response.
     *
     * @param {Object} request - The request object from Express.
     * @param {Object} response - The response object from Express.
     * @param {Function} next - The next middleware function in the stack.
     * @returns {void}
     */
    static async isAuthorized(request, response, next) {
        try {
            const bearer = request.headers.authorization;

            if (!bearer) {
                return response.status(401).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 401,
                        "details": "You are not authorized to access this page!"
                    }
                });
            }

            const token = bearer.split(" ")[1];

            if (!token) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Invalid token"
                    }
                });
            }

            try {
                const user = await AuthController.verifyJWT(token);

                if (user) {
                    request.user = user;
                    next();
                }
            } catch (error) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Invalid token"
                    }
                });
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}
