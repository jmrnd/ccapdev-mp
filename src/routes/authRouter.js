import { Router } from 'express';
import { User } from '../models/User.js';
import passport from 'passport';

const authRouter = Router();

// View Sign Up Page
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

// Registering an account
authRouter.post("/sign-up",  async (req, res) => {
    const validateUser = await User.find({}, {username: true, email: true});

    try{

        // Hash Proces
        const hashedPassword = passwordUtils.generatePassword(req.body.password);

        // Process Data
        const processData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            joinDate: req.body.joinDate,
            icon: req.body.icon,
        }

        //Store in MongoDB
        const result = await User.create(processData);

        console.log(result);
    }
    catch(error) {
        console.log("Username or Email is already taken");
        console.log("Error: " + error)
        res.json(validateUser); // Send the username and email
    }
});

authRouter.get("/login", async(req, res) => {
    res.render("login", {
        layout: 'userEntry.hbs'
    });
    console.log("Currently in: Login Page")
});

authRouter.get("/login", async (req, res) => {
    res.render("login");
    console.log("Currently in: Login Page")
})

// passport.autheticate('local') = use local strategy
authRouter.post('/login', passport.authenticate('local', { failureRedirect: '/sign-up', successRedirect: '/'}));


authRouter.post("/logout", async (req, res, next) => {

    /*
    *   Logout from passport and Destroy Session for security
    */

    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });

});


export default authRouter;