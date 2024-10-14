# MindReveal-API
MindReveal API helps users uncover and organize their inner thoughts effortlessly. With features like user authentication, thought submission, manual categorization and search functionality, it makes you transform complex ideas into structured insights. Built with Node.js, Express.js, and MongoDB.
## How to Run the App

To run the MindReveal API, follow these steps:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/MindReveal-API.git
    cd MindReveal-API
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the application:**
    ```sh
    npm start
    ```

5. **Access the API:**
    Open your browser or API client and navigate to `http://localhost:3000/mindreveal/api/v1`.

Now you can start using the MindReveal API to manage your thoughts and categories.
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
- [Retrieve all categories](#Retrieve-all-categories)
- [Update a category](#Update-a-category)
- [Retrieve a category](#Retrieve-a-category)
- [Delete a category](#Delete-a-category)
- [Delete all categories](#Delete-all-categories)

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

### Retrieve all categories

**GET** `/mindreveal/api/v1/categories`

#### Response

##### If categories retrieved successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Categories retrieved successfully.",
    "data": [/* categories array */]
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

### Update a category

**PUT** `/mindreveal/api/v1/categories/:categoryId`

#### Request body

```json
{
    "name": "Updated category name"
}
```

#### Response

##### If category updated successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Category updated successfully.",
    "data": /* category object */
}
```

##### If category ID is missing:

###### 400 Bad Request

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 400,
        "details": "Category ID is required."
    }
}
```

##### If category isn't found:

###### 404 Not Found

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 404,
        "details": "Category not found."
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

### Retrieve a category

**GET** `/mindreveal/api/v1/categories/:categoryId`

#### Parameters

- `categoryId` (string, required): ID of the category to retrieve.

#### Response

##### If category retrieved successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Category retrieved successfully.",
    "data": /* category object */
}
```

##### If category isn't found:

###### 404 Not Found

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 404,
        "details": "Category not found."
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

### Delete a category

**DELETE** `/mindreveal/api/v1/categories/:categoryId`

#### Parameters

- `categoryId` (string, required): ID of the category to delete.

#### Response

##### If category deleted successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Category deleted successfully."
}
```

##### If category isn't found:

###### 404 Not Found

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 404,
        "details": "Category not found."
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

### Delete all categories

**DELETE** `/mindreveal/api/v1/categories`

#### Response

##### If categories deleted successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "<number_of_deleted_categories> categories deleted successfully."
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

### Delete a thought from a category

**PUT** `/mindreveal/api/v1/thoughts/:thoughtId/`

#### Request body

```json
{
    "categoryId": null
}
```

#### Response

##### If thought ID is missing:

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

##### If category ID is missing:

###### 400 Bad Request

```json
{
    "status": "error",
    "message": "An error occurred.",
    "error": {
        "code": 400,
        "details": "Category ID is required."
    }
}
```

##### If thought removed from category successfully:

###### 200 OK

```json
{
    "status": "success",
    "message": "Thought deleted from this category successfully.",
    "data": /* updated thought object */
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

### Add a thought to a cateogry

**PUT** `/mindreveal/api/v1/thoughts/:thoughtId`

#### Request body

```json
{
    "category_id": /* category id */
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
