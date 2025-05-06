/**
 * @file ThoughtController.js
 * @brief Controller for managing thoughts in the MindReveal API.
 *
 * This file defines the ThoughtController class, which contains methods for 
 * adding, retrieving, updating, and deleting thoughts associated with users.
 */

import Thought from "../models/thought.js";
import User from "../models/user.js";
import CategoryController from "./CategoryController.js";
import serverErrorsHandler from "../utils/helper.js";
import Category from "../models/category.js";
import mongoose from "mongoose";

/**
 * @class ThoughtController
 * @description Controller for managing user thoughts.
 */
export default class ThoughtController {
    /**
     * @function addThought
     * @description Adds a new thought for the authenticated user and updates user's thoughts array.
     *
     * @param {Object} request - The request object containing the thought content.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response indicating the result of the operation.
     */
    static async addThought(request, response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const thoughtContent = request.body.content;
            const user = request.user;
            
            const thought = await Thought.create([{
                content: thoughtContent
            }], { session });
            
            await User.findByIdAndUpdate(
                user._id,
                { $push: { thoughts: thought[0]._id } },
                { session }
            );
            
            await session.commitTransaction();
            response.status(200).json({
                status: "success",
                message: "Thought added.",
                data: thought
            });
        } catch (error) {
            await session.abortTransaction();
            serverErrorsHandler(response, error);
        } finally {
            session.endSession();
        }
    }

    /**
     * @function getThoughts
     * @description Retrieves all thoughts for the authenticated user from their thoughts array.
     *
     * @param {Object} request - The request object.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response with all thoughts or an error message.
     */
    static async getThoughts(request, response) {
        try {
            const user = await User.findById(request.user._id).populate('thoughts');
            const thoughts = user.thoughts || [];
            
            if (thoughts.length === 0) {
                return response.status(404).json({
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

    /**
     * @function getOneThought
     * @description Retrieves a single thought by its ID.
     *
     * @param {Object} request - The request object containing thought ID.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response with the thought or an error message.
     */
    static async getOneThought(request, response) {
        try {
            const { thoughtId } = request.params;
            if (!thoughtId) {
                return response.status(400).json({
                    status: "error",
                    message: "An error occurred.",
                    error: {
                        code: 400,
                        details: "Thought ID is required."
                    }
                });
            }
            const thought = await Thought.findById(thoughtId);
            if (!thought) {
                return response.status(404).json({
                    status: "error",
                    message: "An error occurred.",
                    error: {
                        code: 404,
                        details: "Thought not found."
                    }
                });
            }
            response.status(200).json({
                status: "success",
                message: "Thought found successfully.",
                data: thought
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function searchThoughts
     * @description Searches for thoughts based on a keyword among user's thoughts.
     *
     * @param {Object} request - The request object containing search parameters.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response with the search results.
     */
    static async searchThoughts(request, response) {
        try {
            const { keyword, page = 1, limit = 5 } = request.query;
            const user = await User.findById(request.user._id);
            const skip = (page - 1) * limit;
            
            const searchQuery = { _id: { $in: user.thoughts } };
            if (keyword) {
                searchQuery.$text = { $search: keyword };
            }
            
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
     * @description Updates an existing thought by its ID and handles category updates.
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
                    status: "error",
                    message: "An error occurred.",
                    error: {
                        code: 400,
                        details: "Thought ID is required."
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
                    status: "error",
                    message: "An error occurred.",
                    error: {
                        code: 404,
                        details: "Thought not found."
                    }
                });
            }
            if (updateData && updateData.hasOwnProperty('category_id')) {
                try {
                    const category = await Category.findById(updateData.category_id);
                    if (category) {
                        category.thoughts.push(updatedThought._id);
                        await category.save();
                    } else {
                        return response.status(404).json({
                            status: "error",
                            message: "Category not found.",
                            error: {
                                code: 404,
                                details: "The specified category does not exist."
                            }
                        });
                    }
                } catch (error) {
                    serverErrorsHandler(response, error);
                }
            }
            response.status(200).json({
                status: "success",
                message: "Thought updated successfully.",
                data: updatedThought
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    /**
     * @function deleteThought
     * @description Deletes a thought by its ID and removes it from user's thoughts array.
     *
     * @param {Object} request - The request object containing the thought ID.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response indicating the result of the deletion.
     */
    static async deleteThought(request, response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { thoughtId } = request.params;
            if (!thoughtId) {
                return response.status(400).json({
                    status: "error",
                    message: "An error occurred.",
                    error: {
                        code: 400,
                        details: "Thought ID is required."
                    }
                });
            }
            await Thought.findByIdAndDelete(thoughtId).session(session);
            await User.findByIdAndUpdate(
                request.user._id,
                { $pull: { thoughts: thoughtId } },
                { session }
            );
            await session.commitTransaction();
            response.status(200).json({
                status: "success",
                message: "Thought deleted successfully.",
                data: []
            });
        } catch (error) {
            await session.abortTransaction();
            serverErrorsHandler(response, error);
        } finally {
            session.endSession();
        }
    }

    /**
     * @function deleteAllThoughts
     * @description Deletes all thoughts for the authenticated user and clears their thoughts array.
     *
     * @param {Object} request - The request object.
     * @param {Object} response - The response object for sending the response.
     * @returns {Object} The JSON response indicating the result of the deletion.
     */
    static async deleteAllThoughts(request, response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const userId = request.user._id;
            const user = await User.findById(userId);
            await Thought.deleteMany({ _id: { $in: user.thoughts } }).session(session);
            await User.findByIdAndUpdate(
                userId,
                { $set: { thoughts: [] } },
                { session }
            );
            await session.commitTransaction();
            response.status(200).json({
                status: "success",
                message: "All thoughts deleted successfully.",
                data: []
            });
        } catch (error) {
            await session.abortTransaction();
            serverErrorsHandler(response, error);
        } finally {
            session.endSession();
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
                    status: "error",
                    message: "An error occurred.",
                    error: {
                        code: 400,
                        details: "Thought ID is required."
                    }
                });
            }
            if (!categoryId) {
                return response.status(400).json({
                    status: "error",
                    message: "An error occurred.",
                    error: {
                        code: 400,
                        details: "Category ID is required."
                    }
                });
            }
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $unset: { category_id: "" } },
                { new: true }
            );
            await Category.findByIdAndUpdate(
                categoryId,
                { $pull: { thoughts: thoughtId } }
            );
            response.status(200).json({
                status: "success",
                message: "Thought removed from category successfully.",
                data: updatedThought
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}