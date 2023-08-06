import { Router } from "express";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";

const searchRouter = Router();

searchRouter.get("/search", async (req, res) => {
    try {
        const searchText = req.query.q;
        const checkSession = await UserSession.findOne({}).populate("userID").exec();

        if (searchText === "") {
            res.redirect("/");
        }

        const posts = await Post.find({
            $or: [
                { title: { $regex: searchText, $options: "i" } },
                { body: { $regex: searchText, $options: "i" } },
            ],
        }).populate("author").exec();

        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                totalComments: post.comments.length,
            };
        });

        if (checkSession) {
            const currentUser = await User.findOne({ _id: checkSession.userID }).lean().exec();

            if (currentUser) {
                res.render("search-results", {
                    isIndex: true,
                    userFound: true,
                    pageTitle: "foroom",
                    currentUser: currentUser,
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
                pageTitle: "foroom",
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