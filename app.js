const express  = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const passport = require("passport");
const localPass = require("passport-local").Strategy;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const session = require("express-session");
const User  = require("./models/user.js");
const { errorH } = require("./utils/error.js");
const helmet = require("helmet");

require('dotenv').config();



const user = require("./router/login.js");
const list = require ("./router/list.js");
const scrap = require("./router/scrap.js");
const clean = require("./router/clean.js");
const event  = require("./router/event.js");
const community = require("./router/community.js");

// Use Helmet for security
app.use(helmet({ contentSecurityPolicy: false }));

// EJS and view configuration
app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing, static files, and method override
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

// Connect to MongoDB
async function main() {
    await mongoose.connect(process.env.DB_CODE); 
    console.log("DB is connected");
}

main().catch(err => console.log(err));

// Session configuration
const sessionOpp = {
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

app.use(session(sessionOpp));
app.use(flash());

// Passport configuration for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPass(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Logging middleware for each request
app.use((req, res, next) => {
    req.date = new Date();
    console.log(req.date, req.method, req.path);
    next();
});

// Setting up flash messages and current user for all responses
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.Error = req.flash("Error");
    res.locals.currUser = req.user || null;
    next();
});
app.use((req, res, next) => {
    req.session.redirectUrl = req.originalUrl; // Example: Store the current URL
    next();
});





// Mounting routes
app.use("/", list);
app.use("/user", user);
app.use("/re", scrap);
app.use("/clean", clean);
app.use("/event", event);
app.use("/community", community);


// (Optional) Global error handler examples:
// app.all("*", (err, req, res,next) => {
//     res.json(err);
//     next();
// });
// app.use((err, req, res, next) => {
//     res.json(err);
// });

// Start the server
app.listen(8080, () => {
    console.log("Port is listening on 8080");
});
