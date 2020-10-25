const checkAuth = (req, res, next) => {
  if(req.session.user){
    next();     //If session exists, proceed to page
  } else {
    var err = new Error("Not logged in!");
    console.log(req.session.user);
    // next(err);  // Error, trying to access unauthorized page!
    res.redirect('/login'); // redirect to login page
  }
}

module.exports = checkAuth;
