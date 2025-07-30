import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
    {
    originalUrl: { 
        type: String, 
        required: true 
    },
    shortUrl: { 
        type: String, 
        required: true, 
        unique: true 
    },
    clicks: { 
        type: Number, 
        default: 0 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    isPasswordProtected: { 
        type: Boolean, 
        default: false 
    },
    isActive: {
        type: Boolean, 
        default: true 
    },
    password: { 
        type: String,
        required:false,
    },
    passwordAttempts: { 
        type: Number, 
        default: 0 
    },
}, 
{
    timestamps: true
} 
);

export default mongoose.model('Url', urlSchema); 