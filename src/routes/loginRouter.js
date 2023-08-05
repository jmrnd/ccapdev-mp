import { Router } from 'express';
import passport from 'passport';




const loginRouter = Router();

loginRouter.get("/login", async (req, res) => {
    res.render("login");
    console.log("Currently in: Login Page")
})

// passport.autheticate('local') = use local strategy
loginRouter.post('/login', passport.authenticate('local', { failureRedirect: '/sign-up', successRedirect: '/'}));


loginRouter.get("/logout", async(req, res, next) => {
    // await UserSession.findOneAndDelete({});

    /*
    *   Logout from passport and Destroy Session for security
    */

    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect("/")
    });
})


export default loginRouter;