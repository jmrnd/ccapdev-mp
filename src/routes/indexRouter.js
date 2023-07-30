import { Router } from "express";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";
import { deltaToHTML } from "../../public/js/post.js"

import profileRouter from "./profileRouter.js";
import postRouter from "./postRouter.js";
import searchRouter from "./searchRouter.js";
import authRouter from "./authRouter.js";

const router = Router();

router.get("/", async function (req, res) {

    try {
        const checkSession = await UserSession.findOne({}).populate("userID").exec();

        const posts = await Post.find({}).populate("author").exec();

        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                body: deltaToHTML(post.body),
                totalComments: post.comments.length,
            };
        });

        if(checkSession){
            const currentSession = await UserSession.findOne({}).populate("userID").exec();
            const currentUser = await User.findOne({ _id: currentSession.userID }).lean().exec();

            if (currentUser) {
            res.render("index", {
                isIndex: true, // This is for adjusting post-width
                userFound: true,
                activeUserSession: currentSession,
                pageTitle: "foroom",
                currentUser: currentUser,
                posts: postsArray,
            });
            }
            else{
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
router.use(authRouter);

export default router;