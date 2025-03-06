const express = require('express');
const router =  express.Router();
const Community = require("../models/community");
const {check , saveRedirectUrl } = require("../utils/middleware");
const multer  = require('multer');
const {storage} = require("../cloudconfig"); 
const upload = multer({ storage });

router.get("/" , async (req,res)=>{
    let q =  await Community.find({})
    .populate("user")
    .populate("comments.user")
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
        req.params.id,
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
      res.redirect(`/community/${req.params.id}`);
  });

  router.delete("/:id/delete" , async (req,res)=>{
    let q = await Community.findByIdAndDelete(req.params.id);
    console.log(q);
    res.redirect("/community");
  })

module.exports = router;