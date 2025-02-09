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



const user = require("./router/login.js");
const list = require ("./router/list.js");
const scrap = require("./router/scrap.js");
const clean = require("./router/clean.js");
const event  = require("./router/event.js");
const community = require("./router/community.js")




app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


main().then(()=>{
    console.log("db is connected")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/reuse');
}


const sessionOpp = {
    secret : "truck",
    resave : false,
    saveUninitialized: true,
    cookie :{
        expires : Date.now() +7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
};

app.use(session(sessionOpp));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPass(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    req.date = new Date();
    console.log(req.date, req.method , req.path);
    next();
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.Error = req.flash("Error");
    res.locals.currUser = req.session.user || null;
    next()
})

app.use("/", list );
app.use("/user", user );
app.use("/re", scrap);
app.use("/clean" , clean);
app.use("/event" , event);
app.use("/community" , community);



app.listen(8080 ,(req,res)=>{
    console.log("Port is listening");
})