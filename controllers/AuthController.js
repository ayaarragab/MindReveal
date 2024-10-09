/**
 * @file AuthController.js
 * @brief Controller for handling authentication-related functionalities in the MindReveal API.
 *
 * This file defines the AuthController class which contains methods for creating 
 * and verifying JSON Web Tokens (JWT), as well as hashing passwords.
 */

import jwt from "jsonwebtoken"; ///< Importing jsonwebtoken library for handling JWT.
import User from "../models/user.js";
import bcrypt from "bcrypt";

export default class AuthController {
    /**
     * @function createJWT
     * @description Generates a JWT for the authenticated user.
     * 
     * This method takes a user object and creates a signed JWT using the user's ID
     * and the secret key from environment variables.
     *
     * @param {Object} user - The user object for whom the JWT is being created.
     * @returns {string} The generated JWT.
     */
    static createJWT(user) {
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET
        );
        return token;
    }

    /**
     * @function verifyJWT
     * @description Verifies the provided JWT and retrieves the associated user.
     * 
     * This method takes a JWT, verifies it using the secret key, and if valid,
     * retrieves the corresponding user from the database. Returns the user object
     * if found; otherwise, returns false.
     *
     * @param {string} token - The JWT to verify.
     * @returns {Object|boolean} The user object if verified, or false if invalid.
     */
    static async verifyJWT(token) {
        try {
            const userJWT = jwt.verify(token, process.env.JWT_SECRET);
            if (userJWT) {
                try {
                    const user = await User.findById(userJWT.id);
                    if (user) return user;
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

    /**
     * @function hashPassword
     * @description Hashes the provided password using bcrypt.
     * 
     * This method takes a plaintext password and returns its hashed version
     * using bcrypt's hashing algorithm.
     *
     * @param {string} password - The plaintext password to hash.
     * @returns {Promise<string>} The hashed password.
     */
    static async hashPassword(password) {
        return await bcrypt.hash(password, 5);
    }
}
