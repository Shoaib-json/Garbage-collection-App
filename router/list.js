const express  = require('express');
const router = express.Router();
const User = require('../models/user');

const { check} = require('../utils/middleware')

router.get("/", (req,res)=>{
    res.render("./listing/home.ejs");
});

router.get("/services" ,(req,res) =>{
    res.render("./listing/service.ejs")
});

router.get('/admin' , check , async(req,res)=>{
    let q = await User.findById(req.user.id);
    console.log(q);
    res.send("json")
})



module.exports = router;