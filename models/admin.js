import mongoose from 'mongoose';
import bcrypt from "bcrypt";

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    refresh_token: { type: String, default: null },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

export default mongoose.model('Admin', adminSchema);