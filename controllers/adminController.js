import User from "../models/user.js"
import serverErrorsHandler from "../utils/helper.js";

export const getUsers = async (_, response) => {
    try {
        const users = await User.find({});
        if (users) {            
            response.status(200).json({
                status: "success",
                message: "Here's all users",
                data: [users]
        });
    }
    } catch (error) {
        serverErrorsHandler(response, error);
    }
}