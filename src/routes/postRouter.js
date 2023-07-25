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

//renders the create post page
postRouter.get("/create-post", async (req, res) => {
    try {
        //gets current logged in user
        const userSession = await UserSession.findOne({}).populate("userID");

        const processCurrentUser = {
            username: userSession.userID.username,
            icon: userSession.userID.icon,
        };

        if (userSession) {
            res.render("create-post", {
                userFound: true,
                currentUser: processCurrentUser,
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

// CREATE POST
postRouter.post("/create_post", async (req, res) => {
    try {
        const userSession = await UserSession.findOne({}).populate("userID");
        const currentUser = await User.findOne({ _id: userSession.userID });

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

// VIEW POST
postRouter.get("/view-post/:postId", async (req, res) => {
    try {
        const userSession = await UserSession.findOne({}).populate("userID");

        const postId = req.params.postId;
        const post = await Post.findOne({
            _id: postId,
        }).populate("author");

        const comments = await Comment.find({ post: post.id }).populate(
            "author"
        );

        const commentsArray = comments.map((comment) => comment.toObject());

        if (post) {
            const processPost = {
                postId: postId,
                author: post.author,
                title: post.title,
                body: post.body,
                postDate: post.postDate,
                editDate: post.editDate,
                totalVotes: post.totalVotes,
                totalComments: post.totalComments,
            };

            const processPostAuthor = {
                username: post.author.username,
                icon: post.author.icon,
            };

            if (userSession) {
                const processCurrentUser = {
                    username: userSession.userID.username,
                    icon: userSession.userID.icon,
                };

                res.render("view-post", {
                    postId: postId,
                    userFound: true,
                    currentUser: processCurrentUser,
                    post: processPost,
                    postAuthor: processPostAuthor,
                    comments: commentsArray,
                    totalComments: commentsArray.length,
                });
            } else {
                res.render("view-post", {
                    postId: postId,
                    userFound: false,
                    currentUser: processCurrentUser,
                    post: processPost,
                    postAuthor: processPostAuthor,
                    comments: commentsArray,
                    totalComments: commentsArray.length,
                });
            }
        } else {
            console.log("No post found");
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
        const currUserData = await User.findOne({ _id: session.userID });

        const currentUser = {
            username: currUserData.username,
            icon: currUserData.icon
        }

        if (getPost) {
            res.render("edit-post", {
                currentUser: currentUser,
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
postRouter.get("/delete-post/:postId", async (req, res) => {
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
            commentDate: Date.now(),
            post: post._id,
            author: currentUser._id,
            totalVotes: 0,
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

//renders edit comments hbs
postRouter.patch("/edit-comment/:postId/:commentId", async (req, res) => {
    console.log("PATCH RECIEVED");
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const comment = await Comment.findOneAndUpdate({_id: commentId}, {body: req.body.updateComment}, {new: true});
        console.log(comment);
        // await Comment.updateOne({id: comment._id}, {body: req.body.updateComment});

    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

//delete comment
postRouter.get("/delete-comment/:postId/:commentId", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;

        // Find the comment to delete
        const commentToDelete = await Comment.findOneAndDelete({
            _id: commentId,
        });

        res.json({postId: postId, commentId: commentId});
    } catch (error) {
        console.error("Error occurred while deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// UPVOTINGS
postRouter.patch("/upvoteIcon/:_id", async (req, res) => {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;

    const post = await Post.findOne({ _id: idParam }); // get post via ID

    let incrementvoteCount = post.totalVotes + 1;
    await Post.updateOne({ _id: idParam }, { totalVotes: incrementvoteCount });
    res.sendStatus(200);
});

// DOWNVOTINGS
postRouter.patch("/downvoteIcon/:_id", async (req, res) => {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;

    const post = await Post.findOne({ _id: idParam }); // get post via ID

    let incrementvoteCount = post.totalVotes - 1;
    await Post.updateOne({ _id: idParam }, { totalVotes: incrementvoteCount });
    res.sendStatus(200);
});

// COMMENT UPVOTINGS
postRouter.patch("/commentUpvoteIcon/:_id", async (req,res)=> {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;
    const comment = await Comment.findOne({ _id: idParam }); // get post via ID

    let incrementVoteCount = comment.totalVotes + 1;
    await Comment.updateOne({_id: idParam} , {totalVotes: incrementVoteCount});
    res.sendStatus(200);
})

// COMMENT DOWNVOTINGS
postRouter.patch("/commentDownvoteIcon/:_id", async (req,res)=> {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;

    const comment = await Comment.findOne({ _id: idParam }); // get post via ID

    let incrementVoteCount = comment.totalVotes - 1;
    await Comment.updateOne({_id: idParam} , {totalVotes: incrementVoteCount});
    res.sendStatus(200);
})


postRouter.post("/create_reply/:commentId", async (req, res) => {
    try {
        // Get the commentId from the request parameters
        const commentId = req.params.commentId;

        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });

        // Find the parent comment to which the reply will be associated
        const parentComment = await Comment.findOne({ _id: commentId });
        if (!parentComment) {
            console.log("No comment found");
            res.status(404).send("Comment not found");
            return;
        }

        // Get the reply data from the request body
        const { reply } = req.body;

        // Create a new Comment instance for the reply
        const newReply = new Comment({
            body: reply,
            commentDate: Date.now(),
            post: parentComment.post,
            author: currentUser._id,
            isReply: true,
            replyTo: parentComment._id,
        });

        // Save the new reply to the database
        await newReply.save();

        // Add the reply to the parent comment's replies array
        parentComment.replies.push(newReply);
        await parentComment.save();

        // Redirect to the updated post's view or any other desired action
        res.redirect(`/view-post/${parentComment.post}`);
    } catch (error) {
        console.error("Error occurred while creating reply:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default postRouter;