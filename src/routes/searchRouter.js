import { Router } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

const searchRouter = Router();

searchRouter.get("/search", async (req, res) => {
    try {
        const searchText = req.query.q;

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
                totalVotes: (post.upVoters.length - post.downVoters.length),
                totalComments: post.comments.length,
            };
        });

        if (req.isAuthenticated()) {
            const currentUser = await User.findById(req.user._id).lean().exec();

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
            res.render("search-results", {
                isIndex: true,
                userFound: false,
                pageTitle: "foroom",
                icon: "/static/images/profile_pictures/pfp_temp.svg",
                posts: postsArray,
                searchText: searchText
            });
        }
    } catch (error) {
        console.error("Error occurred while performing search", error);
        res.status(500).send("Internal Server Error"); 
    }
});

export default searchRouter;