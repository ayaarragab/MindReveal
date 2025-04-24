import serverErrorsHandler from "../utils/helper.js";
import { verifyAToken } from "./jwtHandler.js";


export const authenticate = async(request, response, next) => {
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
                        "details": "Token doesn't exist"
                    }
                });
            }

            try {
                const user = await verifyAToken(token);

                if (user) {
                    request.user = user;
                    next();
                }
            } catch (error) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 408,
                        "details": "Invalid or expired token"
                    }
                });
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
}

