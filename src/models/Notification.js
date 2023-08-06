import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true},
    link: { type: String},
    isRead: { type: Boolean, default: false},
    createdAt: Date,
    notifClass: {
        type: String,
        enum: [
            'Upvote',
            'Comment',
            'Reply',
        ],
        required: true
    },
    contentClass: {
        type: String,
        enum: [
            'Post',
            'Comment'
        ],
        required: true
    },
});

export const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;