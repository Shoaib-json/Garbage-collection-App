const express  = require('express');
const router = express.Router();
const Scrap = require("../models/scrap");
const {check} = require("../utils/middleware");


router.get("/scrap" , (req,res) =>{
    res.render("./listing/scrap.ejs");
});

router.post("/submit" ,check, async(req,res) =>{
    try{
        let {category,price, weight} = req.body;
        let q = await new Scrap({
            category : category,
            price : price,
            weight : weight,
            user : req.user._id
        });
        q.save();
        console.log(q);
        res.send("Submitted");
    }catch (err) {
        console.log(err);
        
    }
} );


module.exports = router;