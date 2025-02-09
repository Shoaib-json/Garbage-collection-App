const express = require('express');
const router =  express.Router();


router.get("/" , (req,res)=>{
    res.render("./community/community.ejs");
})

router.get("/post" , (req,res)=>{
    res.render("/community/post.ejs");
});

module.exports = router;