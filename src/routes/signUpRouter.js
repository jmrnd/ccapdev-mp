import { Router } from 'express';
import { User } from '../models/User.js';
import bcrypt, { hash } from "bcrypt";

const signUp_Router = Router();

const saltRounds = 10;

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

/* Registering an Account: POST */
signUp_Router.post("/sign-up",  async (req, res) => {

    const validateUser = await User.find({}, {username: true, email: true});

    try{
        // Generate Salt
        const salt = bcrypt.genSaltSync(saltRounds);

        // Hashing process
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const processData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            joinDate: req.body.joinDate,
            icon: req.body.icon,
        }

        //Storing
        const result = await User.create(processData);

        console.log("Result:" + result);
    }
    catch(error) {
        console.log("Username or Email is already taken");
        res.json(validateUser); // Send the username and email
    }
});



export default signUp_Router;