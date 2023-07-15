import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    author: String,
    body: String,
    commentDate: Date,
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});


export const Comment = mongoose.model('Comment', CommentSchema);


export default Comment;
