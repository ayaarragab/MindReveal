import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import bcrypt from "bcrypt";

export default class AuthController{
    static createJWT(user) {
        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET
        );
        return token;
    }

    static async verifyJWT(token) {
        try {
            const userJWT = jwt.verify(token, process.env.JWT_SECRET);
            if (userJWT) {
                try {
                    const user = await User.findById(userJWT.id);
                    if (user)
                        return user;
                } catch (error) {
                    console.log('user not found');
                    return false;
                }
            }
        } catch (error) {
            console.log('unknown token not found');
            return false;
        }

    }

    static comparePasswords (passwordPlain, hashedPassword) {
        return bcrypt.compare(passwordPlain, hashedPassword);
    }

    static async hashedPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    
}
