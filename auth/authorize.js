export const authorize = (request, response, next) => {
    
    const role = request.body.role;
    if (role !== undefined) {
        next();
    } else {
        return response.status(403).json({
            "status": "error",
            "message": "An error occurred.",
            "error": {
                "code": 403,
                "details": "You are not authorized to access this page!"
            }
        });
    }
}