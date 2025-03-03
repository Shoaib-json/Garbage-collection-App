const express = require('express');
const router = express.Router();
const {check} = require("../utils/middleware");
const Event = require("../models/event");
const User = require("../models/user");
const multer  = require('multer');
const {storage} = require("../cloudconfig"); 
const upload = multer({ storage });

router.get("/" , async(req,res) =>{
    const q = await Event.find({})
    .populate('user');
   
    res.render("./event/event.ejs", {q});
});

router.get("/host" , check , (req,res) =>{
    res.render("./event/host.ejs")
})

router.post("/create-post", upload.single("poster"), async (req, res) => {
  try {
      console.log("File:", req.file);  
      console.log("Body:", req.body);  

      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      let newEvent = new Event({
          user: req.user._id,
          address: req.body.address, // Ensure address is correctly structured
          description: req.body.description,
          date: req.body.date,
          poster: {
              url: req.file.path, // Store the file path in DB
              filename: req.file.filename || "poster101"
          },
          name: req.body.name || "Event",
          enroll :req.user._id
      });

      await newEvent.save();
      console.log("New Event Created:", newEvent);
      res.redirect("/event");

  } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Server error" });
  }
});


router.put("/:id", check, async (req, res) => {
  try {
      let event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });

      if (event.enroll?.user?.toString() === req.user._id.toString()) {
          return res.status(400).json({ message: "User is already enrolled" });
      }

    
      if (!event.enroll) {
          event.enroll = {};
      }

     
      event.enroll.user = req.user._id;
      let updatedEvent = await event.save();
      req.flash("success" , "Enrolled");
      res.redirect("/event");
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id/delete" , async (req,res)=>{
    let q = await Event.findByIdAndDelete(req.params.id);
    console.log(q);
    res.redirect("/event");
});


module.exports = router;