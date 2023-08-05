import { Router } from "express";
import { User } from "../models/User.js";
// import { UserSession } from "../models/UserSession.js";
import { Post } from "../models/Post.js";

import profileRouter from "./profileRouter.js";
import postRouter from "./postRouter.js";
import searchRouter from "./searchRouter.js";
import signUp_Router from "./signUpRouter.js";
import loginRouter from "./loginRouter.js";

const router = Router();

router.get("/", async function (req, res) {


/**************************** TESTING **************************************** */
    // if(req.isAuthenticated()){
    //     console.log("Username:" + req.user.username);
    //     console.log("userID:" + req.user._id)
    //     const currentSession = req.user._id;
    //     const currentUser = await User.findById(currentSession);
    //     console.log("CurrentUser:" + currentUser);
    // } else {
    //     res.send("No user Found")
    // }

    // if(req.session.viewCount){
    //   req.session.viewCount = req.session.viewCount + 1;
    // }else{
    //   req.session.viewCount = 1;
    // }

    // res.send(`Visited: ${req.session.viewCount}`);

/***************************************************************************** */

    try {
        const posts = await Post.find({}).populate("author");

        const postsArray = posts.map((post) => {
            return {
                ...post.toObject(),
                totalComments: post.comments.length,
            };
        });

      if(req.isAuthenticated()){ // If user is authenticated or logged in
        const currentSession = req.user._id;
        const currentUser = await User.findById(req.user._id);

        const processCurrentUser = {
            username: currentUser.username,
            icon: currentUser.icon,
        };

        if (currentUser) {
          res.render("index", {
            isIndex: true, // This is for adjusting post-width
            userFound: true,
            activeUserSession: currentSession,
            headerTitle: "foroom",
            currentUser: processCurrentUser,
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
          headerTitle: "foroom",
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

router.use(loginRouter);
router.use(profileRouter);
router.use(postRouter);
router.use(searchRouter);
router.use(signUp_Router);


export default router;
