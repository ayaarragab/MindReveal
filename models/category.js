import mongoose from 'mongoose';

const categoryModel = mongoose.Schema({
    name: { type: String, required: true },
    thoughts: [{ type: mongoose.Types.ObjectId, ref: 'Thought', required: false }],
    user_id: { type: mongoose.Types.ObjectId },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Category', categoryModel);
