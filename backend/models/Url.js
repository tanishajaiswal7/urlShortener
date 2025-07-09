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
    // we now need to pass in the user id to the url model
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{
    timestamps: true
}
);

export default mongoose.model('Url', urlSchema); 