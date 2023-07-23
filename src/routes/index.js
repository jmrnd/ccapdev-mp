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
  // let currentUser;
  // let currentSession;

  try {

    // Check Session if there currently ongoing session
    // async function checkSessionCollection(){
    //   try {
    //     const count = await UserSession.countDocuments({});
    //     if(count == 0){
    //       currentUser = null;
    //     }
    //     else{
         
    //     }
    //   }catch(err){
    //     console.log(err);
    //   }
    // }

    // checkSessionCollection(); // Implement Function

    const checkSession = await UserSession.findOne({});


    // console.log(postsArray);
    // console.log(currentSession);
    // console.log(currentUser);

    const posts = await Post.find({}).populate("author");
    const postsArray = posts.map((post) => post.toObject());

    if(checkSession){
      const currentSession = await UserSession.findOne({}).populate("userID");
      const currentUser = await User.findOne({ _id: currentSession.userID });

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

router.use(profileRouter);
router.use(postRouter);
router.use(searchRouter);
router.use(signUp_Router);
router.use(loginRouter);

router.use((req, res) => {
  res.render("404", { title: "Page not Found." });
});

export default router;