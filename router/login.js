const express  = require('express');
const router = express.Router();
const User  = require("../models/user.js");
const passport = require("passport");
const { check }  = require("../utils/middleware.js")
const Address  = require("../models/address.js");

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
        req.login(Q,(err)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect("/user/address");
                console.log(Q)
            }
        })

    }catch (err){
        next();
    }
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/user", // Redirect to '/log' if authentication fails
        // failureFlash: true, // Enable flash messages on failure
        successRedirect: "/user/address", 
        failureMessage: true, // Provide a failure message
    }),
    async (req, res, next) => {
        
        res.send("loggedin")
        
    }
);

router.get("/address", check ,(req,res) =>{
    const q = req.user._id;
    res.render("./listing/address.ejs" , {q});
});

router.post("/:id" , async (req,res) =>{
    const add1 = new Address(req.body);
    await add1.save();
    let q = await User.findById(req.params.id);
    q.address.push(add1);
    await q.save();
    res.send("submitted");
    console.log(q);
    
});



router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }else{res.send("loggged out")}
        // req.flash("Error", "You are loggedOut");
        
    });
});


module.exports = router;