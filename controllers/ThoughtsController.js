import Thought from "../models/thought.js";
import serverErrorsHandler from "./helper.js";

export default class ThoughtController {
    // write a thought
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
                )
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }

    }

    static async getThoughts(request, response) {
        const user = request.user;
        try {
            const thoughts = await Thought.find({user_id: user._id});
            if (!thoughts) {
                response.status(404).json({
                    status: "error",
                    message: "You didn't write your thoughts yet!",
                    data: []
                })
            }
            response.status(200).json({
                status: "success",
                message: "Here's all thoughts that you've written",
                data: thoughts
            })
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    static async searchThoughts(request, response) {
        try {
            const { keyword, page = 1, limit = 10 } = request.query;
            
            const searchQuery = {};
            if (keyword) {
                searchQuery.$text = { $search: keyword };
            }

            const skip = (page - 1) * limit;
            console.log(searchQuery);
            
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
    
            // If the thought is not found
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

    static async addThoughtToCategory(request, response) {

    }

    static async deleteThoughtFromCategory(request, response) {

    }
}
