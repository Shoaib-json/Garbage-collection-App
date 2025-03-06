

module.exports.check = (req, res, next) => {
    console.log(req.user); 

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("Error", "You need to log in first"); 
        return res.redirect("/user/log"); 
    }

    next(); 
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session && req.method === "GET" && !req.path.startsWith("/user")) {
        req.session.redirectUrl = req.originalUrl;
        console.log("✅ Redirect URL Saved:", req.session.redirectUrl); // Debugging
    } else {
        console.log("❌ Redirect URL NOT Saved. Path:", req.path);
    }
    next();
};



module.exports.logIn = (req, res) => {
    let redirectUrl = req.session.redirectUrl || "/";
    delete req.session.redirectUrl; // Clear session after redirect
    res.redirect(redirectUrl);
};
