const express = require('express');
const router = express.Router();
const Shop = require("../models/shop")
const multer  = require('multer');
const {storage} = require("../cloudconfig"); 
const upload = multer({ storage });
const {check} = require('../utils/middleware');
const { findById } = require('../models/community');

router.get('/', async(req,res)=>{
    let q =  await Shop.find();
    res.render("./shop/home.ejs" , {q})
})

router.get("/add" ,check , (req,res)=>{
    res.render("./shop/add.ejs");
});

router.post('/submit', check, upload.array('image', 5), async(req, res) => {
    let {caption, description} = req.body;
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files were uploaded');
    }
    
    // If image is defined as an array in your schema
    let item = new Shop({
        caption: caption,
        description: description,
        image: req.files.map(file => ({
            url: file.path,
            filename: file.filename
        })),
        user: req.user.id
    });
    
    await item.save();
    console.log(item);
    res.render("./shop/home.ejs");
});

router.get("/:id",async (req,res)=>{
    let q = await Shop.findById(req.params.id);
    res.render("./shop/show.ejs" , {q})
});


module.exports = router;