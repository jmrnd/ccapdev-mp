import { Router } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { UserSession } from "../models/UserSession.js";
import { Comment } from "../models/Comment.js";
import bodyParser from "body-parser";

const postRouter = Router();

//used for parsing text from hbs files to here
postRouter.use(bodyParser.urlencoded({ extended: true }));
postRouter.use(bodyParser.json());

//setting date
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;

const formattedToday = mm + "/" + dd + "/" + yyyy;

//renders the create post page
postRouter.get("/create-post", async (req, res) => {
    try {
        //gets current logged in user
        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });

        if (currentUser) {
            res.render("create-post", {
                username: currentUser.username,
                icon: currentUser.icon,
            });
        } else {
            // No user found
            console.log("No user found");
            // To redirect to an error page
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

//creating post then returns to the home page
postRouter.post("/create_post", async (req, res) => {
    try {
        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });
        // Extract data from the form
        const { title, text } = req.body;
        // Create a new Post instance
        const newPost = new Post({
            title,
            body: text,
            author: currentUser,
            postDate: new Date(),
            totalVotes: 0,
            totalComments: 0,
            comments: [],
        });

        // Save the new post to the database
        await newPost.save();

        // Redirect to a success page or perform any other actions
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving post to the database.");
    }
});

//renders the post
postRouter.get("/view-post/:postId", async (req, res) => {
    try {
        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });

        const postId = req.params.postId;
        const getPost = await Post.findOne({ _id: postId })
            .populate("comments") // Populate the 'comments' field with Comment documents
            .exec();
        const postOP = await User.findOne({ _id: getPost.author });

        let bool = false;
        if (postOP.username === currentUser.username) {
            bool = true;
        }

        const commentIds = getPost.comments;
        const comments = await Comment.find({ _id: { $in: commentIds } });

        //comments output
        //console.log(comments);
        //console.log(commentIds);
        //console.log(getPost.comments);

        if (getPost) {
            res.render("view-post", {
                postId: postId,
                equal: bool,
                icon: postOP.icon,
                date: getPost.postDate,
                postOP: postOP.username,
                title: getPost.title,
                text: getPost.body,
                votes: getPost.totalVotes,
                numcomments: getPost.totalComments,
                currentuser: currentUser.username,
                comments: getPost.comments,
            });
        } else {
            // No post found
            console.log("No post found");
            // To redirect to an error page
            res.status(404).send("Post not found");
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

//edits post
postRouter.get("/edit-post/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const getPost = await Post.findOne({ _id: postId });

        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });

        if (getPost) {
            res.render("edit-post", {
                username: currentUser.username,
                icon: currentUser.icon,
                title: getPost.title,
                body: getPost.body,
                postId: postId,
            });
        } else {
            // No post found
            console.log("No post found");
            // To redirect to an error page
            res.status(404).send("Post not found");
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

//update post from edit-post
postRouter.post("/update_post/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, text } = req.body;

        const postToUpdate = await Post.findOne({ _id: postId });

        if (postToUpdate) {
            // Update the post properties
            postToUpdate.title = title;
            postToUpdate.body = text;

            // Save the updated post to the database
            await postToUpdate.save();

            // Redirect to the updated post's view
            res.redirect(`/view-post/${postId}`);
        } else {
            console.log("No post found");
            res.status(404).send("Post not found");
        }
    } catch (error) {
        console.error("Error occurred while updating post:", error);
        res.status(500).send("Internal Server Error");
    }
});

//delete post
postRouter.post("/delete_post/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find the post to delete
        const postToDelete = await Post.findOneAndDelete({ _id: postId });
        res.redirect("/");
    } catch (error) {
        console.error("Error occurred while deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});

postRouter.post("/create_comment/:postId", async (req, res) => {
    try {
        // Get the postId from the request parameters
        const postId = req.params.postId;

        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });

        // Find the post to which the comment will be associated
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            console.log("No post found");
            res.status(404).send("Post not found");
            return;
        }

        // Get the comment data from the request body
        const { comment } = req.body;

        // Create a new Comment instance
        const newComment = new Comment({
            body: comment,
            commentDate: formattedToday,
            author: currentUser._id,
        });

        // Save the new comment to the database
        await newComment.save();

        // Add the comment to the post's comments array
        post.comments.push(newComment);
        post.totalComments++; // Increase the total comments count
        await post.save();

        // Redirect to the updated post's view or any other desired action
        res.redirect(`/view-post/${postId}`);
    } catch (error) {
        console.error("Error occurred while creating comment:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default postRouter;
