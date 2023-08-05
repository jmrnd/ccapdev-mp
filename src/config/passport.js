import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from "../models/User.js";
import passwordUtils from '../userAuth/passwordHelpers.js';

console.log("IM IN PASSPORT");


/*
*   Function -> Pertains to field verifyCallback will accept
*   Importance -> email field cannot be passed so we customize the field usernameField = 'email'
*                 for email to be accept in verifyCallback();
*/
const customField = {
  usernameField: "email",
  passwordField: "password",
}


/*
 *  Function -> Gets submitted data from "/login" through passport.authenticate() and verify if user is
 *              in UserModel and check if password is correct ( Hashing Helpers included )
*/

const verifyCallback = async (email, password, done) => {
  await User.findOne({ email: email })
  .then((user) => {

      if(!user){  // No user found
          return done(null, false) // null = no error, but no user
      }

      const isValid = passwordUtils.generatePassword(password, user.password);

      if(isValid){
          return done(null, user); // null = no error, pass 'user' object
      } else {
          return done(null, false) // null = no error but not authenticated because wrong password
      }
  })
  .catch((err) => {
      done(err)
  })

}

// Create new LocalStrategy
const strategy = new LocalStrategy(customField, verifyCallback)

// Middleware to make use of strategy
passport.use(strategy);

/*
 *  Function -> If user is found and valid password in we serialize and store user.id in our session
 *  Observe in session the field -> passport: {user.id}
*/
passport.serializeUser((user,done)=>{
  done(null,user.id);
})


/*
 *  Function -> deserializes user.id
 *  Note: Basically we find the USER and access the fields inside that user
*/
passport.deserializeUser((userId,done)=>{
  User.findById(userId)
      .then((user) => {
          done(null,user);
      })
      .catch(err => done(err));
})