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
    console.log(q);
    res.render("./event/event.ejs", {q});
});

router.get("/host" , check , (req,res) =>{
    res.render("./event/host.ejs")
})

router.post("/create-post", upload.single("poster"), async (req, res) => {
  try {
      console.log("File:", req.file);  // Debugging: Check uploaded file
      console.log("Body:", req.body);  // Debugging: Check form data

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
      let updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        {  enroll: { user: req.user._id  }}, // Prevents duplicate enrollments
        { new: true }
      );
  
      if (!updatedEvent) return res.status(404).send("Event not found");
  
      res.json(updatedEvent); 
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

module.exports = router;