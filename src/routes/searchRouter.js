import { Router } from "express";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";

const searchRouter = Router();

searchRouter.get("/search", async (req, res) => {
    try {
        const searchText = req.query.q;
        const checkSession = await UserSession.findOne({});

        if (searchText === "") {
            res.redirect("/");
        }

        const posts = await Post.find({
            $or: [
                { title: { $regex: searchText, $options: "i" } },
                { body: { $regex: searchText, $options: "i" } },
            ],
        }).populate("author");

        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                totalComments: post.comments.length,
            };
        });

        if (checkSession) {
            const currentSession = await UserSession.findOne({}).populate("userID");
            const currentUser = await User.findOne({ _id: currentSession.userID });

            if (currentUser) {
                const processCurrentUser = {
                    username: currentUser.username,
                    icon: currentUser.icon,
                };
                res.render("search-results", {
                    isIndex: true,
                    userFound: true,
                    headerTitle: "foroom",
                    currentUser: processCurrentUser,
                    posts: postsArray,
                    searchText: searchText,
                });
            } else {
                res.status(404).send("User not found");
            }
        } else {
            res.render("index", {
                isIndex: true,
                userFound: false,
                headerTitle: "foroom",
                icon: "/static/images/profile_pictures/pfp_temp.svg",
                posts: postsArray,
            });
        }
    } catch (error) {
        console.error("Error occurred while performing search", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

export default searchRouter;