import { Router } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { UserSession } from "../models/UserSession.js";
import { Comment } from "../models/Comment.js";
import bodyParser from "body-parser";

const postRouter = Router();

postRouter.use(bodyParser.urlencoded({ extended: true }));
postRouter.use(bodyParser.json());

// renders the create post page
postRouter.get("/create-post", async (req, res) => {
    try {
        const userSession = await UserSession.findOne({}).populate("userID").exec();

        console.log(req.body);

        const processCurrentUser = {
            username: userSession.userID.username,
            icon: userSession.userID.icon,
        };

        if (userSession) {
            res.render("create-post", {
                pageTitle: "Post to foroom",
                userFound: true,
                currentUser: processCurrentUser,
            });
        } else {
            console.log("No user found");
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error");
    }
});

// CREATE POST
postRouter.post("/create_post", async (req, res) => {
    try {
        const userSession = await UserSession.findOne({}).populate("userID").exec();
        const currentUser = await User.findOne({ _id: userSession.userID }).lean().exec();
        
        // Extract data from the form
        const { title, text } = req.body;
        
        const newPost = new Post({
            title,
            body: text,
            author: currentUser,
            postDate: new Date(),
            totalVotes: 0,
            comments: [],
            upVoters: [],
            downVoters: [],
        });

        await newPost.save();

        res.redirect(`/view-post/${newPost._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving post to the database.");
    }
});

// VIEW POST
postRouter.get("/view-post/:postId", async (req, res) => {
    try {
        const userSession = await UserSession.findOne({}).populate("userID").exec();
        const postId = req.params.postId;
        const post = await Post.findOne({ _id: postId,}).populate("author").lean().exec();
        const comments = await Comment.find({ post: post._id })
            .populate({
                path: "author",
                model: "User",
                select: "username icon",
            })
            .populate({
                path: "replies",
                populate: {
                    path: "author",
                    model: "User",
                    select: "username icon",
                },
            })
            .lean()
            .exec();

        if (post) {
            if (userSession) {
                res.render("view-post", {
                    pageTitle: post.title,
                    postId: postId,
                    userFound: true,
                    currentUser: {
                        username: userSession.userID.username,
                        icon: userSession.userID.icon,
                    },
                    post: post,
                    postAuthor: {
                        username: post.author.username,
                        icon: post.author.icon
                    },
                    comments: comments,
                    totalComments: comments.length,
                });
            } else {
                res.render("view-post", {
                    pageTitle: post.title,
                    postId: postId,
                    userFound: false,
                    post: post,
                    postAuthor: {
                        username: post.author.username,
                        icon: post.author.icon
                    },
                    comments: comments,
                    totalComments: comments.length,
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
        const post = await Post.findOne({ _id: postId }).lean().exec();

        const session = await UserSession.findOne({}).populate("userID").exec();

        const currentUser = {
            username: session.userID.username,
            icon: session.userID.icon
        }

        if (post) {
            res.render("edit-post", {
                userFound: true,
                currentUser: currentUser,
                title: post.title,
                body: post.body,
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

        const post = await Post.findOneAndUpdate(
            { _id: postId},
            { body: text, title: title, editDate: new Date()},
            { new: true}
        ).exec();

        res.redirect(`/view-post/${postId}`);
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
            upVoters: [],
            downVoters: [],
        });

        // Save the new comment to the database
        await newComment.save();

        // Add the comment to the post's comments array
        post.comments.push(newComment);
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
        const comment = await Comment.findOneAndUpdate(
            { _id: req.body.commentId, post: req.body.postId },
            { body: req.body.updateComment, editDate: new Date()},
            { new: true }
        ).exec();
        const editDate = comment.editDate;
        const commentDate = comment.commentDate
        res.status(200).json({ editDate, commentDate });
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error 
    }
});

//delete comment
postRouter.delete("/delete-comment/:postId/:commentId", async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.body.commentId,
            post: req.body.postId
        }).exec();

        // Update the array of comments of the post as well (fixes the wrong number of comments displayed in the post cards)
        const post = await Post.updateOne(
            {_id: req.body.postId},
            {$pull: { comments: req.body.commentId}}
        ).exec();
        
        res.status(200).json({postId: comment.post, commentId: comment._id});
    } catch (error) {
        console.error("Error occurred while deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// UPVOTINGS
postRouter.patch("/upvoteIcon/:_id", async (req, res) => {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;

    const session = await UserSession.findOne({});
    if(session) {
        const currentUser = await User.findOne({ _id: session.userID });

        if(currentUser) {
            const post = await Post.findOne({ _id: idParam }); // get post via ID
            const hasVoted = post.upVoters.includes(currentUser._id);

            if(hasVoted === false) {
                let incrementvoteCount = post.totalVotes + 1;
                await Post.updateOne({ _id: idParam }, { totalVotes: incrementvoteCount }, {new: true});
                post.upVoters.push(currentUser._id);
                await post.save();
                const hasDownvoted = post.downVoters.includes(currentUser._id);
                if(hasDownvoted) {
                    const updateDownvoters = post.downVoters.filter(voter => !voter.equals(currentUser._id));
                    await Post.updateOne({ _id: idParam }, { downVoters: updateDownvoters }, {new: true});
                }
            }
        }
    }
    res.sendStatus(200);

});

// DOWNVOTINGS
postRouter.patch("/downvoteIcon/:_id", async (req, res) => {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;

    const session = await UserSession.findOne({});
    if(session) {
        const currentUser = await User.findOne({ _id: session.userID });

        if(currentUser) {
            const post = await Post.findOne({ _id: idParam }); // get post via ID
            const hasDownvoted = post.downVoters.includes(currentUser._id);

            if(hasDownvoted === false) {
                let decrementvoteCount = post.totalVotes - 1;
                await Post.updateOne({ _id: idParam }, { totalVotes: decrementvoteCount }, {new: true});
                post.downVoters.push(currentUser._id);
                await post.save();
                const hasVoted = post.upVoters.includes(currentUser._id);
                if(hasVoted) {
                    const updateUpvoters = post.upVoters.filter(voter => !voter.equals(currentUser._id));
                    await Post.updateOne({ _id: idParam }, { upVoters: updateUpvoters }, {new: true});
                }
            }
        }
    }
    res.sendStatus(200);
});

// COMMENT UPVOTINGS
postRouter.patch("/commentUpvoteIcon/:_id", async (req,res)=> {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;
    const session = await UserSession.findOne({});
    if(session) {
        const currentUser = await User.findOne({ _id: session.userID });

        if(currentUser) {
            const comment = await Comment.findOne({ _id: idParam }); // get comment via ID
            const hasVoted = comment.upVoters.includes(currentUser._id);

            if(hasVoted === false) {
                let incrementVoteCount = comment.totalVotes + 1;
                await Comment.updateOne({_id: idParam} , {totalVotes: incrementVoteCount}, {new: true});
                comment.upVoters.push(currentUser._id);
                await comment.save();
                const hasDownvoted = comment.downVoters.includes(currentUser._id);
                if(hasDownvoted) {
                    const updateDownvoters = comment.downVoters.filter(voter => !voter.equals(currentUser._id));
                    await Comment.updateOne({ _id: idParam }, { downVoters: updateDownvoters }, {new: true});
                }
            }
        }
    }
    res.sendStatus(200);
})

// COMMENT DOWNVOTINGS
postRouter.patch("/commentDownvoteIcon/:_id", async (req,res)=> {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;

    const session = await UserSession.findOne({});
    if(session) {
        const currentUser = await User.findOne({ _id: session.userID });

        if(currentUser) {
            const comment = await Comment.findOne({ _id: idParam }); // get post via ID
            const hasDownvoted = comment.downVoters.includes(currentUser._id);

            if(hasDownvoted === false) {
                let decrementvoteCount = comment.totalVotes - 1;
                await Comment.updateOne({ _id: idParam }, { totalVotes: decrementvoteCount }, {new: true});
                comment.downVoters.push(currentUser._id);
                await comment.save();
                const hasVoted = comment.upVoters.includes(currentUser._id);
                if(hasVoted) {
                    const updateUpvoters = comment.upVoters.filter(voter => !voter.equals(currentUser._id));
                    await Comment.updateOne({ _id: idParam }, { upVoters: updateUpvoters }, {new: true});
                }
            }
        }
    }
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