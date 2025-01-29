
module.exports.check = (req, res, next) => {
    console.log("Authenticated User:"); // Logs the user object if authenticated

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL for redirection after login
        req.flash("error", "You need to log in first"); // Display an error message
        return res.redirect("/user/log"); // Redirect to login page
    }

    next(); // Proceed to the next middleware or route handler
};