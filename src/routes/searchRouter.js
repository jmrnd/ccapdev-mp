import { Router } from "express";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";

const searchRouter = Router();

searchRouter.get("/search", async (req, res) => {
    try {
        const searchText = req.query.q;
        const currentSession = await UserSession.findOne({}).populate("userID");
        const currentUser = await User.findOne({ _id: currentSession.userID });

        if (searchText === "") {
            res.redirect("/");
        } else {
            const posts = await Post.find({
                $or: [
                    { title: { $regex: searchText, $options: "i" } },
                    { body: { $regex: searchText, $options: "i" } },
                ],
            }).populate("author");

            const postsArray = posts.map((post) => post.toObject());

            // console.log(postsArray);
            if (currentUser) {
                res.render("search-results", {
                    userFound: true,
                    activeUserSession: currentSession,
                    headerTitle: "foroom",
                    username: currentUser.username,
                    icon: currentUser.icon,
                    posts: postsArray,
                    searchText: searchText,
                });
            } else {
                res.render("search-results", {
                    posts: postsArray,
                    searchText: searchText,
                });
            }
        }
    } catch (error) {
        console.error("Error occurred while performing search", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});

export default searchRouter;
