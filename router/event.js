const express = require('express');
const router = express.Router();
const {check} = require("../utils/middleware");
const Event = require("../models/event");

router.get("/" , async(req,res) =>{
    const q = await Event.find({})
    .populate("user");
    console.log(q);
    res.render("./event/event.ejs", {q});
});

router.get("/host" , check , (req,res) =>{
    res.render("./event/host.ejs")
})

router.post("/create-post" , async (req,res) =>{
    let newEvent = new Event({user : req.user._id , ...req.body});
    await newEvent.save();
    console.log(newEvent);
    res.redirect("/event");
})

module.exports = router;