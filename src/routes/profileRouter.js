import { Router } from "express";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";
const profileRouter = Router();

profileRouter.get("/edit-profile", async (req, res) => {
    try {
        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });

        if (currentUser) {
            // User found
            res.render("edit-profile", {
                username: currentUser.username,
                displayName: currentUser.displayName,
                password: currentUser.password,
                email: currentUser.email,
                description: currentUser.description,
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

profileRouter.patch("/edit-profile", async (req, res) => {
    console.log("PATCH request received for /users");
    try {
        const session = await UserSession.findOne({});
        const data = await User.findOneAndUpdate(
            { _id: session.userID },
            req.body,
            { new: true }
        );
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

profileRouter.get("/view-profile/:username", async (req, res) => {
    try {
        const usernameParam = req.params.username;
        const user = await User.findOne({ username: usernameParam });

        console.log(user);

        if (user) {
            const processUser = {
                username: user.username,
                displayName: user.displayName,
                description: user.description,
                email: user.email,
                icon: user.icon,
                password: user.password,
                joinDate: user.joinDate,
            };

            const posts = await Post.find({
                author: user,
            }).populate("author");
            const postsArray = posts.map((post) => post.toObject());

            console.log(postsArray);

            res.render("view-profile", {
                user: processUser,
                posts: postsArray,
            });
        } else {
            res.status(404).send("User not found"); // or redirect to an error page
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // or redirect to an error page
    }
});

export default profileRouter;
