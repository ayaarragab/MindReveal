import mongoose from 'mongoose';

const thoughtModel = mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId },
    content: { type: String, required: true },
    category_id: { type: mongoose.Types.ObjectId, default: null },
    created_at: { type: Date, default: Date.now }
})

export default mongoose.model('Thought', thoughtModel);
