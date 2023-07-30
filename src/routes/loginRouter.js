import { Router } from 'express';
import { User } from '../models/User.js';
import { UserSession } from "../models/UserSession.js";
import express from 'express';

const loginRouter = Router();

loginRouter.get("/login", async(req, res) => {
    res.render("login", {
        layout: 'account.hbs'
    });
    console.log("Currently in: Login Page")
})

loginRouter.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

loginRouter.post("/login", async (req, res) => {
    const {email, password} = req.body; // Get email and password
    const user = await User.findOne({email}); // Find email in User

    // console.log(email, password);
    // console.log(user);

    // Check if email already Registered
    if(!user){
        res.redirect("/sign-up")
        console.log( email + " is not found");
    }
    else{
        // Check password
        if(password != user.password){
            console.log("Wrong password")
            res.redirect("/sign-up")
        }
        else{
            console.log("Login Successfuly")
            await UserSession.create({userID: user.id})
            res.redirect("/");
        }
    }
});

loginRouter.get("/logout", async(req, res) => {
    await UserSession.findOneAndDelete({});
    console.log("Just Logged out");
    res.redirect("/");
})


export default loginRouter;