const express  = require('express');
const router = express.Router();
const User = require('../models/user');
const Address = require('../models/address')

const { check} = require('../utils/middleware')

router.get("/", (req,res)=>{
    res.render("./listing/home.ejs");
});

router.get("/services" ,(req,res) =>{
    res.render("./listing/service.ejs")
});

router.get('/admin' , check , async(req,res)=>{
    let q = await User.findById(req.user.id)
    .populate("address").lean();
    res.render('./listing/user.ejs' , {q});
    console.log(q)
});

router.get('/:id/edit' , async (req,res)=>{
    const q = await Address.findById(req.params.id)
    console.log(q)
    res.render("./listing/editAdd.ejs" , {q});
});

router.put('/:id/edit' , async (req,res)=>{
    const q = await Address.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    console.log(q)
    res.render("./listing/editAdd.ejs" , {q});
});

router.get("/map", (req, res) => {
    res.render("./listing/map.ejs");
});

router.get("/aboutme",(req,res)=>{
    res.render("./listing/about.ejs")
})

router.get("/privacy-policy",(req,res)=>{
    res.render("./listing/privacy.ejs")
})
module.exports = router;