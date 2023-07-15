import { Router } from 'express';
import { User } from '../models/User.js';
const profileRouter = Router();

profileRouter.get("/edit-profile", async (req, res) => {
    try {
        const currentUser = await User.findOne({ loggedIn: true });
    
        if (currentUser) {
          // User found
            res.render("edit-profile", {
                username: currentUser.username,
                displayName: currentUser.displayName,
                password: currentUser.password,
                email: currentUser.email,
                description: currentUser.description,
            });
        } else {
            // No user found
            console.log("No user found");
            // To redirect to an error page
            res.status(404).send("User not found");
        }
      } catch (error) {
          console.error("Error occurred while retrieving user:", error);
          res.status(500).send("Internal Server Error"); // To redirect to an error page
      }
});

profileRouter.patch("/edit-profile", async (req, res) => {
    console.log("PATCH request received for /users");
    try {
        const currentUser = await User.findOne({ loggedIn: true });
        const data = await User.findOneAndUpdate({ username: currentUser.username }, req.body, { new: true })
        res.sendStatus(200);
    } catch (error) {
      console.error(err);
      res.sendStatus(500);
    }
});

// TO DO: view own profile
profileRouter.get("/view-profile", async (req, res) => {
    try {
        const currentUser = await User.findOne({ loggedIn: true });
        if (currentUser) {
          // User found
            res.render("view-profile", {
                loginFlag: true,
                username: currentUser.username,
                displayName: currentUser.displayName,
                description: currentUser.description,
                title: "Test Title",
                body: "Test Body",
                votes: 3,
                comments: 15
            });
        } else {
            res.status(404).send("User not found"); // or redirect to an error page
        }
      } catch (error) {
          console.error("Error occurred while retrieving user:", error);
          res.status(500).send("Internal Server Error"); // or redirect to an error page
      }
});

// TO DO: view other profiles
profileRouter.get("/view-profile/:id", async (req, res) => {
});

export default profileRouter;