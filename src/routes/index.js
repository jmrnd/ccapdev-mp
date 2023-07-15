import { Router } from 'express';
import profileRouter from './profileRouter.js';
import { User } from '../models/User.js';

const router = Router();

router.get("/", async (req, res) => {
    const currentUser = await User.findOne({ loggedIn: true });

    // Temp just for visualization, just change it
    res.render("index", { 
        loginFlag: true, // false
        title: "Foroom",
        username: currentUser.username,
        displayName: currentUser.displayName,
        description: currentUser.description,
        title: "Test Title",
        body: "Test Body",
        votes: 3,
        comments: 15
        });
});

router.get("/home", (req, res) => {
    res.redirect("/");                     
});

router.get("/homepage", (req, res) => {
    res.redirect("/");
});

router.use(profileRouter);

router.use((req, res) => {
    res.render("404", {title: "Page not Found."});
});

export default router;