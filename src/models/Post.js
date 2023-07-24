import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    body: String,
    postDate: Date,
    editDate: Date,
    totalVotes: Number,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of Comments
});

export const Post = mongoose.model("Post", PostSchema);

export default Post;
