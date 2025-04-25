export const authorize = (request, response, next) => {
    if (request.body.role !== undefined) {
        next();
    } else {
        return response.status(401).json({
            "status": "error",
            "message": "An error occurred.",
            "error": {
                "code": 401,
                "details": "You are not authorized to access this page!"
            }
        });
    }
}