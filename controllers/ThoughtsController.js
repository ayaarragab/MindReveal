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
                    status: 404,
                    message: "You didn't write your thoughts yet!",
                    data: []
                })
            }
            response.status(200).json({
                status: 200,
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
                status: 200,
                message: "Search completed successfully.",
                data: thoughts
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    static async filterThoughts(request, response) {

    }
}
