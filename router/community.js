const express = require('express');
const router =  express.Router();
const Community = require("../models/community");
const {check} = require("../utils/middleware");
const multer  = require('multer');
const {storage} = require("../cloudconfig"); 
const upload = multer({ storage });

router.get("/" , async (req,res)=>{
    let q =  await Community.find({});
    res.render("./community/community.ejs" , {q});
});

router.get("/post",check , (req,res)=>{   
    
    res.render("./community/post.ejs");
});

router.post("/submit" ,check, upload.single("image"), async (req,res) =>{
    if(!req.user){
        res.flash("success" , "first login")
    }
    let {caption} =req.body ;
    let post = new Community({
        image: {
            url: req.file.path, // Store the file path in DB
            filename: req.file.filename || "poster101"
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