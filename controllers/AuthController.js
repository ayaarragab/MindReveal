/**
 * @file AuthController.js
 * @brief Controller for handling authentication-related functionalities in the MindReveal API.
 *
 * This file defines the AuthController class which contains methods for creating 
 * and verifying JSON Web Tokens (JWT), as well as hashing passwords.
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.js";

const ENCRYPTION_KEY = process.env.AES_SECRET_KEY.slice(0, 32); // 256-bit key
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts[0], "hex");
    const encryptedText = textParts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

export default class AuthController {
    /**
     * @function createJWT
     * @description Generates a JWT with encrypted payload.
     *
     * @param {Object} user - The user object for whom the JWT is being created.
     * @returns {string} The generated JWT.
     */
    static createJWT(user) {
        const encryptedPayload = encrypt(JSON.stringify({ id: user.id }));
        const token = jwt.sign(
            { data: encryptedPayload },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return token;
    }

    /**
     * @function verifyJWT
     * @description Verifies the JWT and decrypts the payload to get the user.
     *
     * @param {string} token - The JWT to verify.
     * @returns {Object|boolean} The user object if valid, else false.
     */
    static async verifyJWT(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded?.data) {
                const decrypted = decrypt(decoded.data);
                const { id } = JSON.parse(decrypted);
                const user = await User.findById(id);
                if (user) return user;
            }
        } catch (error) {
            console.log("Invalid or tampered token:", error.message);
        }
        return false;
    }

    /**
     * @function hashPassword
     * @description Hashes a password using bcrypt.
     *
     * @param {string} password - The plain password.
     * @returns {Promise<string>} The hashed password.
     */
    static async hashPassword(password) {
        return await bcrypt.hash(password, 5);
    }
}