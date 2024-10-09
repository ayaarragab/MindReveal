/**
 * @file category.js
 * @brief Category model schema for the MindReveal application.
 * 
 * This file defines the Mongoose schema for categories, which can hold
 * multiple thoughts associated with a user.
 */
import mongoose from 'mongoose';

const categoryModel = mongoose.Schema({
    name: { type: String, required: true },
    thoughts: [{ type: mongoose.Types.ObjectId, ref: 'Thought', required: false }],
    user_id: { type: mongoose.Types.ObjectId },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Category', categoryModel);
