import { Router } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { UserSession } from "../models/UserSession.js";
import { Comment } from "../models/Comment.js";
import { Notification } from "../models/Notification.js";
import bodyParser from "body-parser";

const postRouter = Router();

postRouter.use(bodyParser.urlencoded({ extended: true }));
postRouter.use(bodyParser.json());

// renders the create post page
postRouter.get("/create-post", async (req, res) => {
    try {
        const session = await UserSession.findOne({}).populate("userID").exec();

        console.log(req.body);

        const processCurrentUser = {
            username: session.userID.username,
            icon: session.userID.icon,
        };

        if (session) {
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
        
        const { title, text } = req.body;
        
        const newPost = new Post({
            title,
            body: text,
            author: currentUser,
            postDate: new Date(),
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
        const session = await UserSession.findOne({}).populate("userID").exec();
        const postId = req.params.postId;
        const post = await Post.findOne({ _id : postId }).populate("author").exec();
        const comments = await Comment.find({ post: post._id }).populate("author").exec();

        const processPost = {
            ...post.toObject(),
            totalVotes: (post.upVoters.length - post.downVoters.length),
            totalComments: post.comments.length
        }

        if (session) {
            const currentUser = await User.findOne({ _id : session.userID._id }).lean().exec();
            currentUser._id = currentUser._id.toString();

            if (post) {
                const commentsArray = comments.map((comments) => {
                    return {
                        ...comments.toObject(),
                        totalVotes: (comments.upVoters.length - comments.downVoters.length),
                        currentUser: currentUser._id
                    };
                });

                res.render("view-post", {
                    userFound: true,
                    isIndex: true,
                    isPost: true,
                    pageTitle: post.title,
                    currentUser: currentUser,
                    post: processPost,
                    postAuthor: {
                        username: post.author.username,
                        icon: post.author.icon
                    },
                    comments: commentsArray
                });
            } else {
                console.log("No post found.");
                res.status(404).send("Post not found.");
            }
        } else {
            const commentsArray = comments.map((comments) => {
                return {
                    ...comments.toObject(),
                    totalVotes: (comments.upVoters.length - comments.downVoters.length),
                };
            });

            res.render("view-post", {
                userFound: false,
                isIndex: true,
                isPost: true,
                pageTitle: post.title,
                post: processPost,
                postAuthor: {
                    username: post.author.username,
                    icon: post.author.icon
                },
                comments: commentsArray
            })
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
            upVoters: [],
            downVoters: [],
        });

        // Save the new comment to the database
        await newComment.save();

        // Add the comment to the post's comments array
        post.comments.push(newComment);
        await post.save();

        const notifRecipient = await User.findOne({ _id: post.author._id}).exec();

        if (!(notifRecipient === currentUser)) { // prevents users from sending notifs to themselves
            const newNotif = new Notification({
                recipient: notifRecipient,
                fromUser: currentUser._id,
                content: newComment.body,
                link: `/view-post/${postId}`,
                notifClass: 'Comment',
                contentClass: 'Comment',
                createdAt: newComment.commentDate
            });
    
            const savedNotif = await newNotif.save();
            notifRecipient.notifications.push(savedNotif);
            await notifRecipient.save();
        }

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
    const idParam = req.params._id;
    const session = await UserSession.findOne({}).populate("userID").exec();
    const currentUser = await User.findOne({ _id : session.userID._id}).exec();

    if (session) {
        const post = await Post.findOne({ _id : idParam }).exec(); // get comment via ID
        const hasVoted = post.upVoters.includes(session.userID._id);

        if (hasVoted === false) {
            post.upVoters.push(session.userID._id);
            await post.save();
            const hasDownvoted = post.downVoters.includes(session.userID._id);

            if (hasDownvoted) {
                await Post.updateOne(
                    { _id : idParam },
                    { $pull : { downVoters : session.userID._id } },
                    { new : true }
                ).exec();
            }

            const notifRecipient = await User.findOne({ _id : post.author._id }).exec();

            if (!(notifRecipient === currentUser)) {
                const newNotif = new Notification({
                    recipient: notifRecipient,
                    fromUser: session.userID,
                    content: post.body,
                    link: `/view-post/${idParam}`,
                    notifClass: 'Upvote',
                    contentClass: 'Post',
                    createdAt: new Date()
                });
    
                const savedNotif = await newNotif.save();
                notifRecipient.notifications.push(savedNotif);
                await notifRecipient.save();
            }
        } else { // Uncast vote
            await Post.updateOne(
                { _id : idParam },
                { $pull : { upVoters : session.userID._id} },
                { new : true }
            ).exec();
        }
        res.sendStatus(200);
    }
});

// DOWNVOTINGS
postRouter.patch("/downvoteIcon/:_id", async (req, res) => {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;
    const session = await UserSession.findOne({}).populate("userID").exec();

    if (session) {
        const post = await Post.findOne({ _id: idParam }); // get post via ID
        const hasDownvoted = post.downVoters.includes(session.userID._id);

        if(hasDownvoted === false) {
            post.downVoters.push(session.userID._id);
            await post.save();
            const hasVoted = post.upVoters.includes(session.userID._id);

            if (hasVoted) {
                await Post.updateOne(
                    { _id : idParam }, 
                    { $pull : { upVoters : session.userID._id }},
                    { new : true}
                ).exec();
            }
        } else {
            await Post.updateOne(
                { _id : idParam },
                { $pull : { downVoters : session.userID._id } },
                { new : true },
            ).exec();
        }
        res.sendStatus(200);
    }
});

// COMMENT UPVOTINGS
postRouter.patch("/commentUpvoteIcon/:_id", async (req,res)=> {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;
    const session = await UserSession.findOne({}).populate("userID").exec();
    const currentUser = await User.findOne({ _id : session.userID._id}).exec();

    if (session) {
        const comment = await Comment.findOne({ _id : idParam }).exec(); // get comment via ID
        const hasVoted = comment.upVoters.includes(session.userID._id);

        if (hasVoted === false) {
            comment.upVoters.push(session.userID._id);
            await comment.save();
            const hasDownvoted = comment.downVoters.includes(session.userID._id);

            if (hasDownvoted) {
                await Comment.updateOne(
                    { _id : idParam },
                    { $pull : { downVoters : session.userID._id } },
                    { new : true }
                ).exec();
            }

            const notifRecipient = await User.findOne({ _id : comment.author }).exec();

            if (!(notifRecipient === currentUser)) {
                const newNotif = new Notification({
                    recipient: notifRecipient,
                    fromUser: session.userID,
                    content: comment.body,
                    link: `/view-post/${comment.post}`,
                    notifClass: 'Upvote',
                    contentClass: 'Comment',
                    createdAt: new Date()
                })
    
                const savedNotif = await newNotif.save();
                notifRecipient.notifications.push(savedNotif);
                await notifRecipient.save();
            }
        } else {
            await Comment.updateOne(
                { _id : idParam },
                { $pull : { upVoters : session.userID._id} },
                { new : true }
            ).exec();
        }
        res.sendStatus(200);
    }
});

// COMMENT DOWNVOTINGS
postRouter.patch("/commentDownvoteIcon/:_id", async (req,res)=> {
    console.log("PATCH RECIEVED");
    const idParam = req.params._id;
    const session = await UserSession.findOne({}).populate("userID").exec();

    if (session) {
        const comment = await Comment.findOne({ _id: idParam }); // get post via ID
        const hasDownvoted = comment.downVoters.includes(session.userID._id);

        if(hasDownvoted === false) {
            comment.downVoters.push(session.userID._id);
            await comment.save();
            const hasVoted = comment.upVoters.includes(session.userID._id);

            if (hasVoted) {
                await Comment.updateOne(
                    { _id : idParam }, 
                    { $pull : { upVoters : session.userID._id }},
                    { new : true}
                ).exec();
            }
        } else {
            await Comment.updateOne(
                { _id : idParam },
                { $pull : { downVoters : session.userID._id } },
                { new : true },
            ).exec();
        }
        res.sendStatus(200);
    }
});

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