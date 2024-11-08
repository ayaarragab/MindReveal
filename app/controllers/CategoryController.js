/**
 * @file CategoryController.js
 * @brief Controller for managing categories in the MindReveal API.
 *
 * This file defines the CategoryController class which contains methods for creating,
 * retrieving, updating, and deleting categories in the application.
 */

import Category from "../models/category.js";
import serverErrorsHandler from "./helper.js";

export default class CategoryController {
    /**
     * @function createCateogry
     * @description Creates a new category for the authenticated user.
     *
     * This method takes the category name from the request body, validates it,
     * and creates a new category in the database. Returns the created category.
     *
     * @param {Object} request - The request object containing the category name.
     * @param {Object} response - The response object for sending the response.
     */
    static async createCateogry(request, response) {
        try {
            const { name } = request.body;
            if (!name) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Category name is required."
                    }
                });
            }
            const user_id = request.user._id;
            const category = await Category.create({
                name,
                user_id
            });
            response.status(200).json({
                "status": "success",
                "message": `You've created the category ${category.name} successfully`,
                "data": category
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function retrieveCategories
     * @description Retrieves all categories for the authenticated user.
     *
     * This method fetches all categories associated with the user from the database
     * and returns them. If no categories are found, an appropriate message is sent.
     *
     * @param {Object} request - The request object for retrieving categories.
     * @param {Object} response - The response object for sending the response.
     */
    static async retrieveCategories(request, response) {
        const user_id = request.user._id;
        try {
            const categories = await Category.find({ user_id });
            if (!categories || categories.length === 0) {
                response.status(404).json({
                    "status": "error",
                    "message": "You've not created any categories yet!",
                    "error": {
                        "code": 404,
                    }
                });
            }
            response.status(200).json({
                "status": "success",
                "message": `Here's all your categories`,
                "data": categories
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function retrieveCategory
     * @description Retrieves a specific category by its ID.
     *
     * This method takes a category ID from the request parameters and retrieves the
     * corresponding category from the database. If the category is not found, an error
     * message is returned.
     *
     * @param {Object} request - The request object containing the category ID.
     * @param {Object} response - The response object for sending the response.
     */
    static async retrieveCategory(request, response) {
        try {
            const { categoryId } = request.params;
            if (!categoryId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Category ID is required."
                    }
                });
            }
            try {
                const category = await Category.findOne({ _id: categoryId });
                if (!category) {
                    return response.status(404).json({
                        "status": "error",
                        "message": "An error occurred.",
                        "error": {
                            "code": 404,
                            "details": "This category doesn't exist"
                        }
                    });
                }
                response.status(200).json({
                    "status": "success",
                    "message": `Here's ${category.name} category`,
                    "data": category
                });
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function updateCateogry
     * @description Updates an existing category by its ID.
     *
     * This method takes the category ID from the request parameters and the new
     * data from the request body to update the category in the database. 
     * Returns the updated category if successful.
     *
     * @param {Object} request - The request object containing the category ID and new data.
     * @param {Object} response - The response object for sending the response.
     */
    static async updateCateogry(request, response) {
        try {
            const { categoryId } = request.params;
            const updateData = request.body;

            if (!categoryId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Category ID is required."
                    }
                });
            }

            const updatedCat = await Category.findByIdAndUpdate(
                categoryId,
                updateData,
                { new: true }
            );

            if (!updatedCat) {
                return response.status(404).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 404,
                        "details": "Category not found."
                    }
                });
            }

            response.status(200).json({
                "status": "success",
                "message": "Category updated successfully.",
                "data": updatedCat
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function deleteCateogry
     * @description Deletes a specific category by its ID.
     *
     * This method takes a category ID from the request parameters and deletes the
     * corresponding category from the database. A success message is returned upon deletion.
     *
     * @param {Object} request - The request object containing the category ID.
     * @param {Object} response - The response object for sending the response.
     */
    static async deleteCateogry(request, response) {
        try {
            const { categoryId } = request.params;

            if (!categoryId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Category ID is required."
                    }
                });
            }
            try {
                await Category.findByIdAndDelete(categoryId);
                response.status(200).json({
                    "status": "success",
                    "message": "Category deleted successfully.",
                    "data": []
                });
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function deleteAllCategories
     * @description Deletes all categories for the authenticated user.
     *
     * This method deletes all categories associated with the authenticated user
     * and returns a success message indicating the number of categories deleted.
     *
     * @param {Object} request - The request object for deleting categories.
     * @param {Object} response - The response object for sending the response.
     */
    static async deleteAllCategories(request, response) {
        try {
            const userId = request.user._id;

            const result = await Category.deleteMany({ user_id: userId });

            if (result.deletedCount === 1) {
                response.status(200).json({
                    status: "success",
                    message: `${result.deletedCount} category deleted successfully.`,
                });
            } else {
                response.status(200).json({
                    status: "success",
                    message: `${result.deletedCount} categories deleted successfully.`,
                });
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}
