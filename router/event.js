const express = require('express');
const router = express.Router();
const {check} = require("../utils/middleware");
const Event = require("../models/event");
const User = require("../models/user");

router.get("/" , async(req,res) =>{
    const q = await Event.find({})
    .populate('user');
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
});

router.put("/:id", check, async (req, res) => {
    try {
      let updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { enroll: { user: req.user._id } } }, // Prevents duplicate enrollments
        { new: true }
      );
  
      if (!updatedEvent) return res.status(404).send("Event not found");
  
      res.json(updatedEvent); // Respond with updated event
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

module.exports = router;