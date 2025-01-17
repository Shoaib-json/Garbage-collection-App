
module.exports.check = (req, res, next) => {
    console.log(req.user); 

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("success", "You need to log in first"); 
        return res.send("Success")
    }
    next(); 
};