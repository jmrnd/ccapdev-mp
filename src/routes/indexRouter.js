import { Router } from "express";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";

import profileRouter from "./profileRouter.js";
import postRouter from "./postRouter.js";
import searchRouter from "./searchRouter.js";

const router = Router();

router.get("/", async function (req, res) {
    try {
        const currentSession = await UserSession.findOne({}).populate("userID");
        const currentUser = await User.findOne({ _id: currentSession.userID });
        const posts = await Post.find({}).populate("author");
        const postsArray = posts.map((post) => post.toObject());

        // console.log(postsArray);
        // console.log(currentSession

        if (currentUser) {
            res.render("index", {
                isIndex: true, // This is for adjusting post-width
                userFound: true,
                activeUserSession: currentSession,
                headerTitle: "foroom",
                username: currentUser.username,
                icon: currentUser.icon,
                posts: postsArray,
            });
        } else {
            res.render("index", {
                userFound: false,
                headerTitle: "foroom",
                icon: "static/images/profile_pictures/pfp_temp.svg",
            });
        }
    } catch (error) {
        console.error("Error finding user", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/home", (req, res) => {
    res.redirect("/");
});

router.get("/homepage", (req, res) => {
    res.redirect("/");
});

router.use(profileRouter);
router.use(postRouter);
router.use(searchRouter);

export default router;
