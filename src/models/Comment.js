import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    body: String,
    commentDate: Date,
    totalVotes: Number,
    isEdited: Boolean,
    replies: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}], // array of comments, self-referencing
    upVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;