import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true},
    link: { type: String},
    isRead: { type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now},
    notifClass: {
        type: String,
        enum: [
            'Upvote',
            'Comment',
            'Reply',
        ],
        required: true
    }
});

export const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;