import serverErrorsHandler from "./helper.js";
import AuthController from "../controllers/AuthController";

export default class AuthMiddlewares{
    static async isAuthorized(request, response, next) {
        try {
            const bearer = request.headers.authorization;
            if (!bearer) {
                return response.status(401).json(
                    {
                        "status": "error",
                        "message": "An error occurred.",
                        "error": {
                            "code": 401,
                            "details": "You are not authorized to access this page!"
                        }
                    }
                )
            }
            const token = bearer.split(" ")[1];
            if (!token) {
                return res.status(400).json({
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
                return res.status(400).json({
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
