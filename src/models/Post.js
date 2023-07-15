import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    author: String,
    title: String,
    body: String,
    postDate: Date,
    totalVotes: Number,
    totalComments: Number,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}] // Array of Comments
});


export const Post = mongoose.model('Post', PostSchema);


export default Post;