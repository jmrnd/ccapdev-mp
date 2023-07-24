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

        const post = await Post.findOne({
            _id: postId,
        }).populate("author");

        const comments = await Comment.find({ post: post.id }).populate(
            "author"
        );

        const commentsArray = comments.map((comment) => comment.toObject());

        if (post) {
            const processPost = {
                author: post.author,
                title: post.title,
                body: post.body,
                postDate: post.postDate,
                editDate: post.editDate,
                totalVotes: post.totalVotes,
                totalComments: post.totalComments,
            };

            const processCurrentUser = {
                username: post.author.username,
                icon: post.author.icon,
            };

            const processPostAuthor = {
                username: post.username,
                displayName: post.author.displayName,
                description: post.author.description,
                email: post.author.email,
                icon: post.author.icon,
                password: post.author.password,
                joinDate: post.author.joinDate,
            };

            //checks if the post is the users'
            let bool = false;
            if (post.author.username === currentUser.username) {
                bool = true;
            }

            const testBool = true;

            res.render("view-post", {
                currentUser: processCurrentUser,
                totalComments: commentsArray.length,
                equal: testBool,
                postId: post._id,
                post: processPost,
                postAuthor: processPostAuthor,
                comments: commentsArray,
            });
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
postRouter.delete("/delete-post/:postId", async (req, res) => {
    try {
      const postId = req.params.postId;
      console.log(`Received request to delete post with id: ${postId}`);
  
      // Find the post to delete
      const postToDelete = await Post.findOneAndDelete({ _id: postId });
      console.log(`Post with id: ${postId} deleted successfully.`);
      res.status(200).send({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(`Error occurred while deleting post with id: ${postId}`, error);
      res.status(500).send({ error: "Internal Server Error" });
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
