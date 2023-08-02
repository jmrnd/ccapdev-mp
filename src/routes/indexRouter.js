import { Router } from "express";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";

import profileRouter from "./profileRouter.js";
import postRouter from "./postRouter.js";
import searchRouter from "./searchRouter.js";
import signUp_Router from "./signUpRouter.js";
import loginRouter from "./loginRouter.js";

const router = Router();

router.get("/", async function (req, res) {

    // try {
        const user = await UserSession.find().populate('userID').lean();
        console.log(user);
        console.log(user.session.userID);
    //     const checkSession = await UserSession.findOne({});

    //     const posts = await Post.find({}).populate("author");

    //     const postsArray = posts.map((post) => {
    //         return {
    //             ...post.toObject(),
    //             totalComments: post.comments.length,
    //         };
    //     });

    //   if(checkSession){
    //     const currentSession = await UserSession.findOne({}).populate("userID");
    //     const currentUser = await User.findOne({ _id: currentSession.userID });

    //     const processCurrentUser = {
    //         username: currentUser.username,
    //         icon: currentUser.icon,
    //     };

    //     if (currentUser) {
    //       res.render("index", {
    //         isIndex: true, // This is for adjusting post-width
    //         userFound: true,
    //         activeUserSession: currentSession,
    //         headerTitle: "foroom",
    //         currentUser: processCurrentUser,
    //         posts: postsArray,
    //       });
    //     }
    //     else{
    //       res.status(404).send("User not found");
    //     }
    //   } else {
    //     res.render("index", {
    //       isIndex: true,
    //       userFound: false,
    //       headerTitle: "foroom",
    //       icon: "/static/images/profile_pictures/pfp_temp.svg",
    //       posts: postsArray,
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error finding user", error);
    //   res.status(500).send("Internal Server Error");
    // }
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
router.use(signUp_Router);
router.use(loginRouter);

export default router;
