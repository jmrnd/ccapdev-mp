import { Router } from 'express';
import { User } from '../models/User.js';

const signUp_Router = Router();

/**********************************
    Things to do more:
    1. Hash Password

 ***********************************/

/* View Sign Up Page */
signUp_Router.get("/sign-up", async (req, res) => {
    try {
        res.render("sign-up");
        console.log("Currently in: Sign Up Page")
    }
    catch (error) {
        console.log(error);
    }
})

// signUp_Router.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

signUp_Router.post("/sign-up",  async (req, res) => {
    try{
        await User.create(req.body);
        res.redirect("/login")
    }
    catch(error) {
        console.log(error);
    }
});



export default signUp_Router;

