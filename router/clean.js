const express = require("express");
const router = express.Router();
const Clean = require("../models/clean");
const {check , saveRedirectUrl} = require("../utils/middleware");

router.get("/form",(req,res) =>{
    res.render("./listing/clean.ejs");
});

router.post("/submit", check ,async (req,res) =>{
    try{
        let {service, date ,time} = req.body;
        let q = await new Clean({
            service : service,
            date : date ,
            time : time,
            user : req.user._id
        });
        q.save();
        console.log(q),
        res.send("submitted")
    }catch (err){
        console.log(err)
    }
});




module.exports = router;
