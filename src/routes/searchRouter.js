import { Router } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Notification } from "../models/Notification.js"

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
                res.render("search-results", {
                    isIndex: true,
                    userFound: true,
                    pageTitle: `Foroom | "${searchText}"`,
                    currentUser: currentUser,
                    posts: postsArray,
                    searchText: searchText,
                    notifs: currentUser.notifications,
                    newNotifs: newNotifs
                });
            } else {
                res.status(404).send("User not found");
            }
        } else {
            res.render("search-results", {
                isIndex: true,
                userFound: false,
                pageTitle: `Foroom | "${searchText}"`,
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