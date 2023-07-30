import { Router } from 'express';
import { User } from '../models/User.js';
import { UserSession } from "../models/UserSession.js";

import express from 'express';

const authRouter = Router();

authRouter.get("/sign-up", async (req, res) => {
    try {
        res.render("sign-up", {
            layout: 'userEntry.hbs'
        });
        console.log("Currently in: Sign Up Page")
    }
    catch (error) {
        console.log(error);
    }
})

authRouter.post("/sign-up",  async (req, res) => {
    try{
        await User.create(req.body);
        res.redirect("/login")
    }
    catch(error) {
        console.log(error);
    }
});

authRouter.get("/login", async(req, res) => {
    res.render("login", {
        layout: 'userEntry.hbs'
    });
    console.log("Currently in: Login Page")
});

authRouter.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

authRouter.post("/login", async (req, res) => {
    const {email, password} = req.body; // Get email and password
    const user = await User.findOne({email: email}).exec(); // Find email in User

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

authRouter.get("/logout", async(req, res) => {
    const session = await UserSession.findOneAndDelete({}).exec();
    console.log("Just Logged out");
    res.redirect("/");
})

export default authRouter;