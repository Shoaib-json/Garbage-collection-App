const express  = require('express');
const router = express.Router();
const User  = require("../models/user.js");
const passport = require("passport");
const { check , saveRedirectUrl , logIn   }  = require("../utils/middleware.js")
const Address  = require("../models/address.js");
const Community = require('../models/community.js');

router.get("/log" , (req,res) =>{
    res.render("./listing/login.ejs")
});

router.get("/sign" , (req,res)=>{
    res.render("./listing/sign.ejs")
});

router.post("/sign" ,async (req,res,next)=>{
    try{
        let {email,password, username} = req.body;
        let user = new User({
            email : email,
            username : username 
        });
        let Q  = await User.register(user,password);
        req.flash("success" , "you are loggedin")
        req.login(Q,(err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash("success" , "you are loggedin")
                res.redirect("/user/address");
                console.log(Q)
            }
        })

    }catch (err){
        next();
    }
});

router.get("/admin" , async (req,res)=>{

    res.render("./listing/user.ejs");
})

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/user/log", // Redirect to '/log' if authentication fails
        failureFlash: true, // Enable flash messages on failure
        
        failureMessage: true, // Provide a failure message
    }),(req,res)=>{
        res.redirect("/")
    }
);

router.get("/address", check ,async(req,res) =>{
    const user = await User.findById(req.user.id).populate("address");
        
    res.render("./listing/address.ejs" , {user});
});

router.post("/:id" , async (req,res) =>{
    const add1 = new Address(req.body);
    await add1.save();
    let q = await User.findById(req.params.id);
    q.address.push(add1);
    await q.save();
    req.flash("success" , "you are loggedin")
    res.redirect("/")
    console.log(q);
    
});



router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }else{res.redirect("/")}
        // req.flash("Error", "You are loggedOut");
        
    });
});





  
module.exports = router;