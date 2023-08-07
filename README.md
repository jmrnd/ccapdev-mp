# CCAPDEV-MP-WebForum
- Machine Project for CCAPDEV T3 2022-2023
- S13 Group 2

## Foroom
https://ccapdev-mp-webforum.onrender.com

## Group Members
- HIDALGO, FRANCISCO JOSE NANZAN
- MIRANDA, JAMAR LANCE FERNANDEZ
- SARMIENTO, RAFAEL MICHAEL RAMOS
- SIMBAHON, JOOLZ RYANE CHAVEZ

## .env Setup
- `MONGODB_URI=mongodb://0.0.0.0:27017/foroom`
- `SERVER_PORT=3000`
- `SECRET_KEY=keep-this-a-secret`

## Setting Server Port
- Locate the `main()` function in your `app.js` file.
- Find the line of code that looks like this:
```
app.listen(process.env.PORT, () => {
    console.log("Express app now listening...");
});
```
- Replace `process.env.PORT` with `process.env.SERVER_PORT`, like so:
```
app.listen(process.env.SERVER_PORT, () => {
    console.log("Express app now listening...");
});
```

## Local Setup
- Make sure that you have a `.env` file present in your build directory.
- Ensure that MongoDB is installed - https://www.mongodb.com/try/download/community
- Clone the repository or download the ZIP file of the repository and unzip.
- Open a terminal in the directory of the unzipped folder.
- Run `npm i` to install the necessary dependencies.
- To run the application, run the following command: `npm start`
- To access the web application, go to your web browser and enter the following URL: `http://localhost:3000/`

## Dependencies
- `bcrypt` - https://www.npmjs.com/package/bcrypt
- `body-parser` - https://www.npmjs.com/package/body-parser
- `connect-mongodb-session` - https://www.npmjs.com/package/connect-mongodb-session
- `dotenv` - https://www.npmjs.com/package/dotenv
- `express` - https://www.npmjs.com/package/express
- `express-handlebars` - https://www.npmjs.com/package/express-handlebars
- `moment` - https://www.npmjs.com/package/moment
- `mongodb` - https://www.npmjs.com/package/mongodb
- `mongoose` - https://www.npmjs.com/package/mongoose
- `passport` - https://www.npmjs.com/package/passport
- `passport-local` - https://www.npmjs.com/package/passport-local
- `validator` - https://www.npmjs.com/package/validator

## Libraries
- Bootstrap v5.3.0 - https://getbootstrap.com/docs/5.3/getting-started/download/
