import mongoose from 'mongoose';

const categoryModel = mongoose.Schema({
    name: { type: String, required: true },
    thoughts: [{ type: mongoose.Types.ObjectId, ref: 'Thought' }],
    created_at: { type: Date, default: Date.now }
});

export default model('Category', categoryModel);
