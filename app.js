// System-related packages
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from 'url';
// Web-app related packages
import mongoose from 'mongoose';
import express from 'express';
import exphbs from 'express-handlebars';
// Routes modules
import router from "./src/routes/index.js";

// TO DO: Move to separate file, db.js
const mongoURI = process.env.MONGODB_URI;
/*
mongoose.connect(mongoURI)
.then(() => console.log("Connected to DB!"));
*/

mongoose.connect('mongodb://127.0.0.1/foroom')
    .then(() => console.log("Connected to DB!"));

async function main () {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();
    app.use("/static", express.static(__dirname + "/public"));
    // Set view engine as Handlebars
    app.engine("hbs", exphbs.engine({
        extname: 'hbs'
    }));
    app.set("view engine", "hbs");
    // Directory for views folder
    app.set("views", "./src/views");
    // View cache to false
    app.set("view cache", false);

    // Receive in JSON format
    app.use(express.json());

    app.use(router);

    app.listen(3000, () => {
        console.log('Hello! Listening at localhost:3000');
    });
    
}

main();

