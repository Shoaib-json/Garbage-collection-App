const express  = require('express');
const router = express.Router();

router.get("/", (req,res)=>{
    res.render("./listing/home.ejs");
});

router.get("/services" ,(req,res) =>{
    res.render("./listing/service.ejs")
})



module.exports = router;