import { Router } from "express";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";

const postRouter = Router();

postRouter.get("/view-post/:postTitle", async (req, res) => {
    try {
        const postTitleParam = req.params.postTitle;
        const formattedPostTitle = postTitleParam.replace(/_/g, " ");

        const post = await Post.findOne({
            title: { $regex: formattedPostTitle, $options: "i" },
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

            const processPostAuthor = {
                username: post.author.username,
                displayName: post.author.displayName,
                description: post.author.description,
                email: post.author.email,
                icon: post.author.icon,
                password: post.author.password,
                joinDate: post.author.joinDate,
            };

            console.log(processPost);
            console.log(processPostAuthor);
            console.log(commentsArray);

            res.render("view-post", {
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

export default postRouter;
