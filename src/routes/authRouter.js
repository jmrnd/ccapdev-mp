import { Router } from 'express';
import { User } from '../models/User.js';
import passport from 'passport';
import passwordUtils from '../userAuth/passwordHelpers.js';
import { check, validationResult} from 'express-validator';

const authRouter = Router();

// Validation Rules
const usernameValidation = check("username").isLength({ min: 5, max: 20 }).withMessage("usernameFormat");
const emailValidation = check("email").isEmail().withMessage("emailFormat");
const passwordValidation = check("password").isLength({ min: 6, max: 15 }).withMessage("passwordFormat");

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
authRouter.post("/sign-up", [usernameValidation, emailValidation, passwordValidation] ,async (req, res) => {

    try{

        // If the input data fails format validation rules, the error data is stored in the errorsArray
        const errors = validationResult(req);
        var errorsArray = errors.array();

        const existingUser = await User.findOne({username: req.body.username}).exec();

        if(existingUser){
            if(existingUser.username == req.body.username){
                const usernameExistsErr = {
                    type: 'field',
                    value: req.body.username,
                    msg: 'usernameExists',
                    path: 'username'
                }
                // usernameExist error data is pushed to errorsArray
                errorsArray.push(usernameExistsErr);
            }

            if(existingUser.email == req.body.email){
                const emailExistsErr = {
                    type: 'field',
                    value: req.body.email,
                    msg: 'emailExists',
                    path: 'email'
                }
                // emailExist error data is pushed to errorsArray
                errorsArray.push(emailExistsErr);
            }
        }

        console.log("-- Validation Errors --");
        console.log(errorsArray);

        if(errorsArray.length > 0) {
            // Sends errorsArray as JSON to frontend to display respective form validation messages
            res.status(422).json({ errors: errorsArray });

        } else {
            // Input data is validated and used to update profile details
            try {

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

            console.log("Result:" + result);
                    res.sendStatus(200);
                } catch (error) {
                    res.sendStatus(500);
                }
            }
    }
    catch(error) {
        console.log("Error: " + error)
        // res.json(validateUser);
    }
});

authRouter.get("/login", async(req, res) => {
    res.render("login", {
        layout: 'userEntry.hbs'
    });
    console.log("Currently in: Login Page")
});

// passport.autheticate('local') = use local strategy
authRouter.post('/login', passport.authenticate('local', { failureRedirect: '/sign-up', successRedirect: '/'}));


authRouter.get("/logout", async (req, res, next) => {
    /*
    *   Logout from passport and Destroy Session for security
    */

    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.session.destroy();
        res.redirect("/");
    });

});


export default authRouter;