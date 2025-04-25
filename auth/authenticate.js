import serverErrorsHandler from "../utils/helper.js";
import { verifyAToken, verifyRToken, createTokens } from "./jwtHandler.js";


export const authenticate = async(request, response, next) => {
        try {
            const bearer = request.headers.authorization;
            const isAdmin = request.body.role !== undefined;

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
                console.log(isAdmin);
                
                const user = await verifyAToken(token, isAdmin);

                if (user) {
                    request.user = user;
                    next();
                } else {                    
                    return response.status(401).json({
                        "status": "error",
                        "message": "An error occurred.",
                        "error": {
                            "code": 401,
                            "details": "Invalid or expired token"
                        }
                    });
                }
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
}

export async function getToken(request, response) {
    const refreshToken = request.body.refreshToken;
    const isAdmin = request.body.role !== undefined;
    
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
        
        const user = await verifyRToken(refreshToken, isAdmin);
        
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
