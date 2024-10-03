const serverErrorsHandler = (response, error) => {
    console.error(error);
    return response.status(500).json({
        "status": "error",
        "message": "An internal server error occurred.",
        "error": {
            "code": 500,
            "details": "Please try again later."
        }
    });
}

export default serverErrorsHandler;
