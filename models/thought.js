/**
 * @file thought.js
 * @brief Thought model schema for the MindReveal application.
 * 
 * This file defines the Mongoose schema for thoughts, which are associated
 * with a user and can be categorized. Each thought contains content and 
 * metadata such as creation date.
 */
import mongoose from 'mongoose';

const thoughtModel = mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId },
    content: { type: String, required: true },
    category_id: { type: mongoose.Types.ObjectId, default: null },
    created_at: { type: Date, default: Date.now }
})

thoughtModel.index({ content: 'text' });

export default mongoose.model('Thought', thoughtModel);
