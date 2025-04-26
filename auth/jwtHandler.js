import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import Admin from "../models/admin.js";
import dotenv from 'dotenv';

dotenv.config();
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

/**
 * @function createTokens
 * @description Creates a JSON Web Token (JWT) for a user.
 *
 * @param {Object} user - The user object.
 * @returns {string} The generated JWT.
 */
export const createTokens = (user) => {
    const accessToken = jwt.sign(
        { data: encrypt(JSON.stringify({ id: user._id })) },
        process.env.JWT_SECRET,
        { expiresIn: "15s" }
    );

    const refreshToken = createRefreshToken(user);
    
    return { accessToken, refreshToken };
}

const createRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        { data: encrypt(JSON.stringify({ id: user._id })) },
        process.env.RJWT_SECRET_KEY,
    );
    return refreshToken;
}


export async function verifyAToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.data) {
            const decrypted = decrypt(decoded.data);
            const { id } = JSON.parse(decrypted);
            const user = await User.findById(id);
            if (!user) {
                const admin = await Admin.findById(id);
                if (admin) return admin;
            } else {
                return user;
            }
            return false;
        }
    } catch (error) {
        console.log("Invalid or tampered token:", error.message);
    }
    return false;
}
export async function verifyRToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.RJWT_SECRET_KEY);

        if (decoded?.data) {
            
            const decrypted = decrypt(decoded.data);
            const { id } = JSON.parse(decrypted);
            const user = await User.findById(id);
            if (!user) {
                const admin = await Admin.findById(id);
                if (admin) return admin;
            } else {
                return user;
            }
            return false;
        }
    } catch (error) {        
        console.log("Invalid or tampered token:", error.message);
    }
    return false;
}