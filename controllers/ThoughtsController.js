import Thought from "../models/thought.js";

export default class ThoughtController {
    // write a thought
    static async addThought(request, response) {
        try {
            const thoughtContent = request.body.content;
            try {
                const user = request.user;
                if (!user) {
                    
                }
            } catch (error) {
                
            }
        } catch (error) {
            
        }

    }

    static async getThoughts(request, response) {

    }

    static async searchThoughts(request, response) {

    }

    static async filterThoughts(request, response) {

    }
}
