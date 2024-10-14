/**
 * @file ThoughtController.js
 * @brief Controller for managing thoughts in the MindReveal API.
 *
 * This file defines the ThoughtController class, which contains methods for 
 * adding, retrieving, updating, and deleting thoughts associated with users.
 */

import Thought from "../models/thought.js";
import serverErrorsHandler from "./helper.js";

/**
 * @class ThoughtController
 * @description Controller for managing user thoughts.
 */
export default class ThoughtController {
    /**
     * @function addThought
     * @description Adds a new thought for the authenticated user.
     *
     * @param {Object} request - The request object containing the thought content.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response indicating the result of the operation.
     */
    static async addThought(request, response) {
        try {
            const thoughtContent = request.body.content;
            const user = request.user;
            try {
                const thought = await Thought.create({
                    user_id: user._id,
                    content: thoughtContent
                });
                response.status(200).json(
                    {
                        "status": "success",
                        "message": "Thought added.",
                        "data": [thought]
                    }
                );
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function getThoughts
     * @description Retrieves all thoughts for the authenticated user.
     *
     * @param {Object} request - The request object.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response with all thoughts or an error message.
     */
    static async getThoughts(request, response) {
        const user = request.user;
        try {
            const thoughts = await Thought.find({user_id: user._id});
            if (!thoughts) {
                response.status(404).json({
                    status: "error",
                    message: "You didn't write your thoughts yet!",
                    data: []
                });
            }
            response.status(200).json({
                status: "success",
                message: "Here's all thoughts that you've written",
                data: thoughts
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    static async getOneThought(request, response) {
        try {
            const { thoughtId } = request.params;
            if (!thoughtId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Thought ID is required."
                    }
                });
            }
            const thought = await Thought.findById(thoughtId);
            if (!thought) {
                return response.status(404).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 404,
                        "details": "Thought not found."
                    }
                });
            }
            response.status(200).json({
                "status": "success",
                "message": "Thought found successfully.",
                "data": thought
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function searchThoughts
     * @description Searches for thoughts based on a keyword.
     *
     * @param {Object} request - The request object containing search parameters.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response with the search results.
     */
    static async searchThoughts(request, response) {
        try {
            const { keyword, page = 1, limit = 10 } = request.query;
            const searchQuery = {};
            if (keyword) {
                searchQuery.$text = { $search: keyword };
            }
            const skip = (page - 1) * limit;
            const thoughts = await Thought.find(searchQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .exec();
            response.status(200).json({
                status: "success",
                message: "Search completed successfully.",
                data: thoughts
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function updateThought
     * @description Updates an existing thought by its ID.
     *
     * @param {Object} request - The request object containing the thought ID and update data.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response with the updated thought or an error message.
     */
    static async updateThought(request, response) {
        try {
            const { thoughtId } = request.params;
            const updateData = request.body;
            if (!thoughtId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Thought ID is required."
                    }
                });
            }
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                updateData,
                { new: true }
            );
            if (!updatedThought) {
                return response.status(404).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 404,
                        "details": "Thought not found."
                    }
                });
            }
            response.status(200).json({
                "status": "success",
                "message": "Thought updated successfully.",
                "data": updatedThought
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function deleteThought
     * @description Deletes a thought by its ID.
     *
     * @param {Object} request - The request object containing the thought ID.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response indicating the result of the deletion.
     */
    static async deleteThought(request, response) {
        try {
            const { thoughtId } = request.params;
            if (!thoughtId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Thought ID is required."
                    }
                });
            }
            try {
                await Thought.findByIdAndDelete(thoughtId);
                response.status(200).json({
                    "status": "success",
                    "message": "Thought deleted successfully.",
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
     * @function deleteAllThoughts
     * @description Deletes all thoughts for the authenticated user.
     *
     * @param {Object} request - The request object.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response indicating the result of the deletion.
     */
    static async deleteAllThoughts(request, response) {
        try {
            const userId = request.user._id;
            const result = await Thought.deleteMany({ user_id: userId });
            response.status(200).json({
                status: "success",
                message: `${result.deletedCount} thoughts deleted successfully.`,
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function deleteThoughtFromCategory
     * @description Removes a thought from a specified category.
     *
     * @param {Object} request - The request object containing thought and category IDs.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response indicating the result of the operation.
     */
    static async deleteThoughtFromCategory(request, response) {
        try {
            const { thoughtId } = request.params;
            const { categoryId } = request.body;
            if (!thoughtId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Thought ID is required."
                    }
                });
            }
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
                const updatedThought = await Thought.findByIdAndUpdate(
                    thoughtId,
                    {categoryId: null},
                    { new: true }
                );
                response.status(200).json({
                    "status": "success",
                    "message": `Thought deleted from this category successfully.`,
                    "data": updatedThought
                });
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}
