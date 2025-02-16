const express = require('express');
const router =  express.Router();
const Community = require("../models/community");
const {check} = require("../utils/middleware")

router.get("/" , async (req,res)=>{
    let q =  await Community.find({});
    res.render("./community/community.ejs" , {q});
});

router.get("/post",check , (req,res)=>{   
    
    res.render("./community/post.ejs");
});

router.post("/submit" ,check, async (req,res) =>{
    if(!req.user){
        res.flash("success" , "first login")
    }
    let { image_url, caption} = req.body;
    let post = new Community({
        image : {
            url : image_url
        },
        caption: caption,
        user : req.user._id
    })
    await post.save();
    
    res.redirect("/community")
});

router.get("/:id" , async (req,res) =>{
    let q = await Community.findById(req.params.id);
    res.render("./community/show.ejs" , {q});
} )

module.exports = router;