import { Router } from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Notification } from "../models/Notification.js"
import passwordUtils from '../userAuth/passwordHelpers.js';

import { check, validationResult } from "express-validator";

// Validation Rules
const usernameValidation = check("username").isLength({ min: 5, max: 20 }).withMessage("usernameFormat");
const displayNameValidation = check("displayName").isLength({ min: 0, max: 20 }).withMessage("displayNameFormat");
const descriptionValidation = check("description").isLength({ min: 0, max: 100 }).withMessage("descriptionFormat");
const emailValidation = check("email").isEmail().withMessage("emailFormat");
const passwordValidation = check("password").isLength({ min: 0, max: 15 }).withMessage("passwordFormat");

const profileRouter = Router();

// Retrieve edit profile page
profileRouter.get("/edit-profile", async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const currentUser = await User.findById(req.user._id).lean().exec();
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
        console.error("Error occurred:" + error);
        res.status(500).send("Internal Server Error");
    }
});

// Edit profile
profileRouter.patch("/edit-profile", [usernameValidation, displayNameValidation, descriptionValidation, emailValidation, passwordValidation] , async (req, res) => {

    // If the input data fails format validation rules, the error data is stored in the errorsArray
    const errors = validationResult(req);
    let errorsArray = errors.array();

    const currentUser = await User.findById(req.user._id).lean().exec();
    const existingUserWithUsername = await User.findOne({ username: req.body.username }).exec();
    const existingUserWithEmail = await User.findOne({ email: req.body.email }).exec();

    // Check if username is taken
    if(existingUserWithUsername) {
        // Checks if username is taken by another user who is not the current user
        if(currentUser.username !== req.body.username) {
            // Create usernameExists error data
            const usernameExistsErr = {
                type: 'field',
                value: req.body.username,
                msg: 'usernameExists',
                path: 'username'
            }
            // usernameExists error data is pushed to errorsArray
            errorsArray.push(usernameExistsErr);
        }
    }

    // Check if email is taken
    if(existingUserWithEmail) {
        // Checks if email is taken by another user who is not the current user
        if(currentUser.email !== req.body.email) {
            // Create usernameExists error data
            const emailExistsErr = {
                type: 'field',
                value: req.body.email,
                msg: 'emailExists',
                path: 'email'
            }
            // emailExists error data is pushed to errorsArray
            errorsArray.push(emailExistsErr);
        }
    }

    if(req.body.password.length < 6) {
        if(req.body.password.length !== 0) {
            const passwordFormatErr = {
                type: 'field',
                value: req.body.password,
                msg: 'passwordFormat',
                path: 'password'
            }
            errorsArray.push(passwordFormatErr);
        }
        
    }

    if(errorsArray.length > 0) {
        // Sends errorsArray as JSON to frontend to display respective form validation messages
        res.status(422).json({ errors: errorsArray });
    } else {
        // Input data is validated and used to update profile details
        try {
            let data;
            // Check if user wants to change password
            if(req.body.password.length !== 0) {
                // Hash password
                const hashedPassword = passwordUtils.generatePassword(req.body.password);
                data = {
                    username: req.body.username,
                    displayName: req.body.displayName,
                    description: req.body.description,
                    email: req.body.email,
                    password: hashedPassword,
                    icon: req.body.icon,
                }
            } else {
                data = {
                    username: req.body.username,
                    displayName: req.body.displayName,
                    description: req.body.description,
                    email: req.body.email,
                    icon: req.body.icon,
                }
            }

            const update = await User.findOneAndUpdate({ _id: req.user._id }, data, { new: true });
            res.sendStatus(200);
        } catch (error) {
            console.error("Error occurred:" + error);
            res.status(500).send("Internal Server Error");
        }
    }

});

// View profile
profileRouter.get("/view-profile/:username", async (req, res) => {
    try {
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

        if (req.isAuthenticated()) {
            const currentUser = await User.findById(req.user._id).populate({
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
          console.error("Error occurred:" + error);
          res.status(500).send("Internal Server Error");
      }
});

// View all posts
profileRouter.get("/view-all-posts/:username", async (req, res) => {
    try {
        const usernameParam = req.params.username;
        const viewUser = await User.findOne({ username: usernameParam}).lean().exec();
        const posts = await Post.find({ author: viewUser._id}).populate("author").exec();

        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                totalVotes: (post.upVoters.length - post.downVoters.length),
                totalComments: post.comments.length,
            };
        });

        if (req.isAuthenticated()) {
            const currentUser = await User.findById(req.user._id).populate({
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
                viewUser: viewUser,
                posts: postsArray
            });
        }
      } catch (error) {
        console.error("Error occurred: ", error);
        res.status(500).send("Internal Server Error");
      }
});

// View all comments
profileRouter.get("/view-all-comments/:username", async (req, res) => {
    try {
        const usernameParam = req.params.username;
        const viewUser = await User.findOne({ username: usernameParam}).lean().exec();
        const comments = await Comment.find({ author: viewUser._id}).populate("author").exec();

        if (req.isAuthenticated()) {
            const currentUser = await User.findById(req.user._id).populate({
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
                viewUser: viewUser,
                comments: commentsArray
            });
        }
      } catch (error) {
        console.error("Error occurred:" + error);
        res.status(500).send("Internal Server Error");
      }
});

export default profileRouter;