import User from "../models/user.js";

export default class UserController {
    static async register(request, response) {
        try {
            const { username, password } = request.body;
            if (!username || !password)
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "username and password are required! One of them is missing."
                    }
                });
            try {
                const user = await User.create({username, password});
                /**
                 * Pending: Token things should be here
                 */
                response.status(200).json({
                    "status": "success",
                    "message": "Request was successful.",
                    "data": [user]
                })
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}
