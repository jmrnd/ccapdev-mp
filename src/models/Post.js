import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    body: String,
    postDate: Date,
    editDate: Date,
    totalVotes: Number,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of Comments
    upVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const Post = mongoose.model("Post", PostSchema);

export default Post;