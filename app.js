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


// Routes modules
import router from "./src/routes/indexRouter.js";

// Custom hbs helpers
import customHelpers from "./src/hbs-helpers/helpers.js";

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

    const store = new MongoDBStore({
        uri: process.env.MONGODB_URI, // Replace with your MongoDB connection URI
        collection: 'usersessions', // Replace with your desired collection name for sessions
    });

    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'this-is-a-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
        store: store,
    }))

    app.engine("hbs", hbs.engine);
    app.set("view engine", "hbs");
    app.set("views", "./src/views");
    app.set("view cache", false);

    // Receive in JSON format
    app.use(express.json());

    app.use(router);

    app.listen(process.env.SERVER_PORT, () => {
        console.log("Hello! Listening at localhost:3000");
    });
}

main();
