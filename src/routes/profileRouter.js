import { Router } from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { UserSession } from '../models/UserSession.js';
import { Notification } from "../models/Notification.js"

const profileRouter = Router();

// Retrieve edit profile page
profileRouter.get("/edit-profile", async (req, res) => {
    try {
        const session = await UserSession.findOne({}).exec();
        if (session) {
            const currentUser = await User.findOne({ _id: session.userID }).lean().exec();
            if (currentUser) {
                res.render("edit-profile", {
                    layout: 'profile.hbs',
                    currentUser: currentUser,
                });
            } else {
                res.status(404).send("User Not Found");
            }
        } else {
            res.status(404).send("Session Not Found");
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

// Edit profile
profileRouter.patch("/edit-profile", async (req, res) => {
    try {
        const session = await UserSession.findOne({}).exec();
        const data = await User.findOneAndUpdate({ _id: session.userID }, req.body, { new: true });
        res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});

// View profile
profileRouter.get("/view-profile/:username", async (req, res) => {
    try {
        const session = await UserSession.findOne({}).populate("userID").exec();
        
        const usernameParam = req.params.username;
        const viewUser = await User.findOne({ username: usernameParam}).lean().exec();
        const posts = await Post.find({ author: viewUser._id}).populate("author").sort({ postDate: -1 }).limit(3).exec();
        const comments = await Comment.find({ author: viewUser._id}).populate("author").sort({ commentDate: -1 }).limit(3).exec();
        
        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                totalVotes: (post.upVoters.length - post.downVoters.length),
                totalComments: post.comments.length,
            };
        });

        // Checks if user is logged in
        if (session) {
            const currentUser = await User.findOne({ _id: session.userID }).populate({
                path: "notifications",
                populate: {
                    path: "fromUser",
                    model: "User",
                    select: "username icon"
                }
            }).lean().exec();

            currentUser.notifications.sort((a, b) => b.createdAt - a.createdAt);
            currentUser._id = currentUser._id.toString();

            const newNotifs = await Notification.countDocuments({ recipient : currentUser._id, isRead : false });

            const commentsArray = comments.map((comments) => {
                return {
                    ...comments.toObject(),
                    totalVotes: (comments.upVoters.length - comments.downVoters.length),
                    currentUser: currentUser._id
                }
            });

            if (currentUser) {
                // User found
                res.render("view-profile", {
                    isIndex: false,
                    isPost: false,
                    pageTitle: viewUser.username,
                    userFound: true,
                    isIndex: false,
                    currentUser: currentUser,
                    viewUser: viewUser,
                    posts: postsArray,
                    comments: commentsArray,
                    notifs: currentUser.notifications,
                    newNotifs: newNotifs
                });
            } else {
                res.status(404).send("User not found");
            }
        } else {

            const commentsArray = comments.map((comments) => {
                return {
                    ...comments.toObject(),
                    totalVotes: (comments.upVoters.length - comments.downVoters.length),
                }
            });

            // If no logged in user, render page with unregistered navbar
            res.render("view-profile", {
                isIndex: false,
                isPost: false,
                pageTitle: viewUser.username,
                userFound: false,
                isIndex: false,
                viewUser: viewUser,
                posts: postsArray,
                comments: commentsArray
            });
        }
      } catch (error) {
          console.error("Error occurred while retrieving user:", error);
          res.status(500).send("Internal Server Error"); // or redirect to an error page
      }
});

// View all posts
profileRouter.get("/view-all-posts/:username", async (req, res) => {
    try {
        const usernameParam = req.params.username;
        const viewUser = await User.findOne({ username: usernameParam}).lean().exec();
        const posts = await Post.find({ author: viewUser._id}).populate("author").exec();
        const session = await UserSession.findOne({}).exec();

        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                totalVotes: (post.upVoters.length - post.downVoters.length),
                totalComments: post.comments.length,
            };
        });

        if (session) {
            const currentUser = await User.findOne({ _id: session.userID }).populate({
                path: "notifications",
                populate: {
                    path: "fromUser",
                    model: "User",
                    select: "username icon"
                }
            }).lean().exec();

            currentUser.notifications.sort((a, b) => b.createdAt - a.createdAt);
            currentUser._id = currentUser._id.toString();

            // Unread notifications
            const newNotifs = await Notification.countDocuments({ recipient : currentUser._id, isRead : false });

            if (currentUser) {
                res.render("view-all-posts", {
                    isIndex: true, 
                    userFound: true,
                    pageTitle: `Posts by ${usernameParam}`,
                    currentUser: currentUser,
                    viewUser: viewUser,
                    posts: postsArray,
                    notifs: currentUser.notifications,
                    newNotifs: newNotifs
                });
            } else {
                res.status(404).send("User not found");
            }
        } else {
            res.render("view-all-posts", {
                isIndex: true,
                userFound: false,
                pageTitle: `Posts by ${usernameParam}`,
                posts: postsArray
            });
        }
      } catch (error) {
        console.error("Error finding user", error);
        res.status(500).send("Internal Server Error");
      }
});

// View all comments
profileRouter.get("/view-all-comments/:username", async (req, res) => {
    try {
        const usernameParam = req.params.username;
        const viewUser = await User.findOne({ username: usernameParam}).lean().exec();
        const comments = await Comment.find({ author: viewUser._id}).populate("author").exec();

        const session = await UserSession.findOne({}).exec();

        if (session) {
            const currentUser = await User.findOne({ _id: session.userID }).populate({
                path: "notifications",
                populate: {
                    path: "fromUser",
                    model: "User",
                    select: "username icon"
                }
            }).lean().exec();

            currentUser.notifications.sort((a, b) => b.createdAt - a.createdAt);
            currentUser._id = currentUser._id.toString();

            // Unread notifications
            const newNotifs = await Notification.countDocuments({ recipient : currentUser._id, isRead : false });

            const commentsArray = comments.map((comments) => {
                return {
                    ...comments.toObject(),
                    totalVotes: (comments.upVoters.length - comments.downVoters.length),
                    currentUser: currentUser._id
                }
            });

            if (currentUser) {
                res.render("view-all-comments", {
                    isIndex: true,
                    isPost: false, 
                    userFound: true,
                    pageTitle: `Comments by ${usernameParam}`,
                    currentUser: currentUser,
                    viewUser: viewUser,
                    comments: commentsArray,
                    notifs: currentUser.notifications,
                    newNotifs: newNotifs
                });
            } else {
                res.status(404).send("User not found");
            }
        } else {
            const commentsArray = comments.map((comments) => {
                return {
                    ...comments.toObject(),
                    totalVotes: (comments.upVoters.length - comments.downVoters.length),
                }
            });
            res.render("view-all-comments", {
                isIndex: true,
                isPost: false,
                userFound: false,
                pageTitle: `Comments by ${usernameParam}`,
                comments: commentsArray
            });
        }
      } catch (error) {
        console.error("Error finding user", error);
        res.status(500).send("Internal Server Error");
      }
});

export default profileRouter;