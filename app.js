// System-related packages
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Web-app related packages
import mongoose from "mongoose";
import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import connectMongoDBSession from 'connect-mongodb-session';
import passport from 'passport';

// Routes modules
import router from "./src/routes/indexRouter.js";
import "./src/config/passport.js"

// Custom hbs helpers
import customHelpers from "./src/hbs-helpers/helpers.js";

// TO DO: Connection of session to mongoDB
const MongoDBStore = connectMongoDBSession(session);

// TO DO: Move to separate file, db.js
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI).then(() => console.log("Connected to DB!"));

async function main() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();
    app.use("/static", express.static(__dirname + "/public"));

    var hbs = exphbs.create({
        helpers: customHelpers,
        defaultLayout: "main",
        partialsDir: __dirname + "/src/views/partials",
        extname: "hbs",
    });

    // Middleware Setup : HANDLEBARS
    app.engine("hbs", hbs.engine);
    app.set("view engine", "hbs");
    app.set("views", "./src/views");
    app.set("view cache", false);

    // Middleware: To recieve JSON FORMAT
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    /*---------------------------------------------- SESSION SETUP -----------------------------------------------------*/

    const store = new MongoDBStore({
        uri: mongoURI, // Replace with your MongoDB connection URI
        collection: 'usersessions', // Replace with your desired collection name for sessions
    });

    app.use(session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
             maxAge: 1000 * 60 * 60 * 24,   //1 day expiration date
        },
    }))
    /* -----------------------------------------------------------------------------------------------------------------*/

    /* ----------------------------------------- PASSWORD AUTHENTICATION -----------------------------------------------*/

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next)=>{
        console.log(req.session);
        console.log(req.user);
        next();
    })

    /* -----------------------------------------------------------------------------------------------------------------*/

    /*******************
     ** Import ROUTER **
     *******************/
    app.use(router);

    app.listen(process.env.SERVER_PORT, () => {
        console.log("Hello! Listening at localhost:3000");
    });
}

main();
