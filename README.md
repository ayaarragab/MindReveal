# MindReveal-API
MindReveal API helps users uncover and organize their inner thoughts effortlessly. With features like user authentication, thought submission, manual categorization and search functionality, it makes you transform complex ideas into structured insights. Built with Node.js, Express.js, and MongoDB.

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Codes](#error-codes)

## Authentication

To access the API, you must include a valid JWT Token in the header. Register to have it.

**Header:**

Authorization: Bearer YOUR_TOKEN

## Endpoints

- [Register](#register)
- [Login](#login)
- [Add a thought](#add-a-thought)
- [Retrieve all thoughts](#retrieve-all-thoughts)
- [Search for thoughts by keyword](#search-for-thoughts-by-keyword)
- [Edit a thought](#edit-a-thought)
- [Delete a thought](#Delete-a-thought)
- [Delete all thoughts](#Delete-all-thoughts)
- [Create a category](#Create-a-category)

### Register

**POST** `/mindreveal/api/v1/register`

#### Request body

```json
{
    "username": "<username>",
    "password": "<password>"
}
```

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

**POST** `/mindreveal/api/v1/login`

#### Request body

```json
{
    "username": "<username>",
    "password": "<password>"
}
```

#### Response

##### If Success:

###### 200 OK

```json
{
    "status": "success",
    "message": "You've logged in successfully",
    "token": "authorization token",
    "data": {
        // user object
    }
}
```

##### If one of the credentials doesn't exist or empty:

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

### Add a thought

**POST** `/mindreveal/api/v1/thoughts`

#### Request body

```json
{
    "content": "<content_to_add>",
    "category_id": "<category_id>" // optional
}
```

#### Response

##### If thought added successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Thought added.",
    "data": [/* Thought object*/ ]
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

##### If the user not authorized to access this endpoint (aka not registered or logged in)

###### 401 Not Authorized

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 401,
        "details": "You are not authorized to access this page!"
    }
}
```


### Retrieve all thoughts

**GET** `/mindreveal/api/v1/thoughts`

#### Response

##### If thoughts retrieved successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Here's all thoughts that you've written",
    "data": /* thoughts array */
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

### Search for thoughts by keyword

**GET** `/mindreveal/api/v1/thoughts/search?keyword=<yout_keyword>&page=<page_num>&limit=<num_of_items>`

- `keyword` (string): Search term for filtering thoughts by content.
- `page` (integer): Page number for pagination.
- `limit` (integer): Number of results per page.

#### Response

##### If thoughts of the keyword retrieved successfully:

```json
{
    "status": 200,
    "message": "Search completed successfully.",
    "data": thoughts
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

### Edit a thought

**PUT** `/mindreveal/api/v1/thoughts/:thoughtId`

#### Request body

```json
{
    "text": "Updated thought content",
    "category_id": "987654321"
}
```

#### Response

##### If thought id doesn't exist in the request body

###### 400 Bad Request

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 400,
        "details": "Thought ID is required."
    }
}
```

##### If thought isn't found:

###### 404 Not Found

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 404,
        "details": "Thought not found."
    }
}
```

##### If thought updated successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Thought updated successfully.",
    "data": /* thought object */
}
```

### Delete a thought

**DELETE** `/mindreveal/api/v1/thoughts/:thoughtId`

#### Parameters

- `thoughtId` (string, required): ID of the thought to delete.

#### Response

##### If thought deleted successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Thought deleted successfully."
}
```

##### If thought isn't found:

###### 404 Not Found

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 404,
        "details": "Thought not found."
    }
}
```

##### If the user is not authorized to access this endpoint (not registered or logged in):

###### 401 Unauthorized

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 401,
        "details": "You are not authorized to access this page!"
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

### Delete all thoughts

**DELETE** `/mindreveal/api/v1/thoughts`

#### Response

##### If thoughts deleted successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "<number_of_deleted_thoughts> thoughts deleted successfully."
}
```

##### If the user is not authorized to access this endpoint (not registered or logged in):

###### 401 Unauthorized

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 401,
        "details": "You are not authorized to access this page!"
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

### Create a category

**POST** `/mindreveal/api/v1/categories`

#### Request body

```json
{
    "name": "<category_name>"
}
```

#### Response

##### If category created successfully:

###### 201 Created

```json
{
    "status": "success",
    "message": "Category created successfully.",
    "data": {
        // category object
    }
}
```

##### If category name is missing:

###### 400 Bad Request

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 400,
        "details": "Category name is required."
    }
}
```

##### If user is not authorized to access this endpoint:

###### 401 Unauthorized

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 401,
        "details": "You are not authorized to access this page!"
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
