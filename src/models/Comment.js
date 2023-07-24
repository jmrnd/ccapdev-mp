import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    body: String,
    commentDate: Date,
    totalVotes: Number,
    editDate: Date,
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    isReply: Boolean,
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});

export const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
