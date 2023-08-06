import { Router } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Notification } from "../models/Notification.js"

import profileRouter from "./profileRouter.js";
import postRouter from "./postRouter.js";
import searchRouter from "./searchRouter.js";
import authRouter from "./authRouter.js";

const router = Router();

router.get("/", async function (req, res) {
    try {
        const posts = await Post.find({}).populate("author").exec();

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

            console.log(currentUser);

            currentUser.notifications.sort((a, b) => b.createdAt - a.createdAt);
            currentUser._id = currentUser._id.toString();

            const newNotifs = await Notification.countDocuments({ recipient : currentUser._id, isRead : false });

            if (currentUser) {
                res.render("index", {
                    isIndex: true,
                    userFound: true,
                    pageTitle: "Foroom",
                    currentUser: currentUser,
                    posts: postsArray,
                    notifs: currentUser.notifications,
                    newNotifs: newNotifs
                });
            }
            else {
                res.status(404).send("User not found");
            }
        } else {
            res.render("index", {
                isIndex: true,
                userFound: false,
                pageTitle: "Foroom",
                icon: "/static/images/profile_pictures/pfp_temp.svg",
                posts: postsArray,
            });
        }
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
    console.log("hi")
  });

router.get("/home", (req, res) => {
    res.redirect("/");
});

router.get("/homepage", (req, res) => {
    res.redirect("/");
});

router.get("/about", async function (req, res) {
  try {

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
            res.render("about", {
                pageTitle: "About",
                userFound: true,
                currentUser: currentUser,
                notifs: currentUser.notifications,
                newNotifs: newNotifs
            });
        } else{
            res.status(404).send("User not found");
        }
    } else {
        res.render("about", {
            pageTitle: "About",
            userFound: false,
        });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/mark-notification-read/:notifId", async (req, res) => {
    const notifId = req.params.notifId;
    console.log(notifId);

    try {
        const notif = await Notification.findByIdAndUpdate(
            notifId,
            { isRead : true },
            { new : true},
        );

        if (!notif) {
            return res.status(404).send("Notification not found.");
        }

        res.status(200).send("Notification marked as read.");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

router.use(profileRouter);
router.use(postRouter);
router.use(searchRouter);
router.use(authRouter);

export default router;