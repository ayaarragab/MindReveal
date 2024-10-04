# MindReveal-API
MindReveal API helps users uncover and organize their inner thoughts effortlessly. With features like user authentication, thought submission, dynamic categorization using BERT for enhanced understanding, and search functionality, it transforms complex ideas into structured insights. Built with Node.js, Express.js, and MongoDB, this API harnesses advanced text processing techniques to streamline thought management.

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Codes](#error-codes)

## Authentication
To access the API, you must include a valid JWT Token in the header. Register to have it.
**Header:**
Authorization: Bearer YOUR_TOKEN

## Endpoints

### Register

**POST** `/api/v1/register`

#### Response

##### If user registered successfully:
###### 200 OK
```json
{
    "status": "success",
    "message": "You've registered successfully.",
    "token": "authorization token",
    "data": {
        // user object
    }
}
```

##### If already user exists:
###### 400 Bad Request
```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
    "code": 400,
    "details": "This username was used before."
    }
}
```

##### If password or username is missing:
###### 400 Bad Request
```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 400,
        "details": "username and password are required! One of them is missing."
    }
}
```

##### If server error:
###### 500 Internal Server Error
```json
{
        "status": "error",
        "message": "An internal server error occurred.",
        "error": {
            "code": 500,
            "details": "Please try again later."
        }
}
```



### Login
**POST** `/api/v1/login`

#### Response

##### If Success:
###### 200 OK
```json
{
    "status": "success",
    "message":  "You've logged in successfully",
    "token": "authorization token",
    "data": {
        // user object
    }
}
```

##### If one of the credintals doesn't exist or empty:
###### 400 Bad Request
```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
    "code": 400,
    "details": "username and password are required! One of them is missing."
    }
}
```

##### If password is invalid or user is not found:
###### 401 Not Authorized
```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 401,
        "details": "Invalid credentials, please try again. If you're new to the API, please register first!"
    }
}
```

##### If password is incorrect:
###### 401 Unauthorized
```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 401,
        "details": "Password is not correct"
    }
}
```

##### If server error:
###### 500 Internal Server Error
```json
{
        "status": "error",
        "message": "An internal server error occurred.",
        "error": {
            "code": 500,
            "details": "Please try again later."
        }
}
```


# error-codes
