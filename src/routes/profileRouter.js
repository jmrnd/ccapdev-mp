import { Router } from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { UserSession } from '../models/UserSession.js';
const profileRouter = Router();

// Retrieve edit profile page
profileRouter.get("/edit-profile", async (req, res) => {
    try {

        if(req.isAuthenticated) {
        const currentUser = await User.findById(req.user._id);
    
        if (currentUser) {
            // User found
            res.render("edit-profile", {
                username: currentUser.username,
                displayName: currentUser.displayName,
                password: currentUser.password,
                email: currentUser.email,
                description: currentUser.description,
                icon: currentUser.icon
            });
        } else {
            res.status(404).send("User Not Found");
        }
        } else {
            res.status(404).send("User not authenticated");
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

// Edit profile
profileRouter.patch("/edit-profile", async (req, res) => {
    console.log("PATCH request received for /users");
    try {

        if(req.isAuthenticated){
            const data = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
            res.sendStatus(200);
        } else {
            console.log("User not Found");
        }

    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});

// View profile
profileRouter.get("/view-profile/:username", async (req, res) => {
    try {
        const usernameParam = req.params.username;
        const viewUser = await User.findOne({ username: usernameParam});

        const posts = await Post.find({ author: viewUser._id}).populate("author");

        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                totalComments: post.comments.length,
            };
        });

        const viewUserData = {
            username: viewUser.username,
            displayName: viewUser.displayName,
            description: viewUser.description,
            icon: viewUser.icon
        }

        // Checks if user is logged in
        if(req.isAuthenticated) {
            const currentUser = await User.findById(req.user._id);
            const currUserData = {
                username: currentUser.username,
                icon: currentUser.icon
            }
            if (currentUser) {
                // User found
                res.render("view-profile", {
                    userFound: true,
                    isIndex: false,
                    currentUser: currUserData,
                    viewUser: viewUserData,
                    posts: postsArray,
                });
            } else {
                res.status(404).send("User not found");
            }
        } else {
            // If no logged in user, render page with unregistered navbar
            res.render("view-profile", {
                userFound: false,
                isIndex: false,
                viewUser: viewUserData,
                posts: postsArray,
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
        const viewUser = await User.findOne({ username: usernameParam});
        const posts = await Post.find({ author: viewUser._id}).populate({
            path: 'author',
            select: 'username',
        }).lean();


        if(req.isAuthenticated) {
            const currentUser = await User.findOne({ _id: req.user._id});

            const currUserData = {
                username: currentUser.username,
                icon: currentUser.icon
            }

            if (currentUser) {
                res.render("view-all-posts", {
                    isIndex: true, // This is for adjusting post-width
                    userFound: true,
                    currentUser: currUserData,
                    posts: posts,
                });
            } else {
                res.status(404).send("User not found");
            }
        } else {
            res.render("view-all-posts", {
                isIndex: true,
                userFound: false,
                posts: posts
            });
        }
      } catch (error) {
        console.error("Error finding user", error);
        res.status(500).send("Internal Server Error");
      }
});

export default profileRouter;
