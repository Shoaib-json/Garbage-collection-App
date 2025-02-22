const express  = require('express');
const router = express.Router();
const User  = require("../models/user.js");
const passport = require("passport");
const { check }  = require("../utils/middleware.js")
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
        successRedirect: "/", 
        failureMessage: true, // Provide a failure message
    }),
    async (req, res, next) => {
        
       console.log(currUser);
        
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

router.put("/:id/like", check, async (req, res) => {
    try {
      const postId = req.params.id;
      
      let updatedPost = await Community.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: req.user._id } }, 
        { new: true, useFindAndModify: false }
      );
  
      if (!updatedPost) {
        return res.status(404).send("Post not found");
      }
  
      console.log(updatedPost);
      res.send("Liked");
    } catch (err) {
      console.error("Error liking post:", err);
      res.status(500).send("Server error");
    }
  });


  router.put("/:id/comment" ,check , async (req,res)=>{
    let {comment} = req.body;
    let updatedPost = await Community.findByIdAndUpdate(
        req.params._id,
        { 
          $push: { 
            comments: { 
              user: req.user.id, 
              comment: comment 
            } 
          } 
        },
        { new: true } )
      
      console.log(req.user.id)
      console.log(updatedPost);
      res.send("commented");
  })
  
module.exports = router;