const express = require('express');
const router = express.Router();
const Shop = require("../models/shop")
const multer  = require('multer');
const {storage} = require("../cloudconfig"); 
const upload = multer({ storage });
const {check} = require('../utils/middleware')

router.get('/', async(req,res)=>{
    let q =  await Shop.find();
    res.render("./shop/home.ejs" , {q})
})

router.get("/add" , (req,res)=>{
    res.render("./shop/add.ejs");
});

router.post('/submit' ,check,upload.single('image'), async(req,res)=>{
    let{caption , description }=req.body;
    let item = new Shop({
        caption : caption ,
        description : description,
        image :{
            url : req.file.path,
            filename : req.file.filename
        },
        user : req.user.id
    });
    await item.save();
    console.log(item);
    res.render("./shop/home.ejs")
})


module.exports = router;