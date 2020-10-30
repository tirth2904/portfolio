var express = require('express')
var router = express.Router()
const { checkAuth } = require('../middlewares');
const db = require("../config/db");
const User = db.users;

// function to check if a variable is empty or null
// returns true if empty
const checkIfEmpty = (k) => {
    return !k || k.length < 1;
}

// GET register 
router.get('/register', function(req, res){
    res.render('register');
});

// POST register
router.post('/register', function(req, res){
    // validate input
    if(
        checkIfEmpty(req.body.username) || 
        checkIfEmpty(req.body.email) || 
        checkIfEmpty(req.body.names) || 
        checkIfEmpty(req.body.password) || 
        checkIfEmpty(req.body.password_confirmation) || 
        checkIfEmpty(req.body.phone)
    )
    {
        res.render('register', {message: "Please enter all fields!"});
    } else if(req.body.password != req.body.password_confirmation){
        // validate passwords
        res.render('register', {message: "The passwords do not match!!"});
    } else {
        User.findOne({
            username: req.body.username
        })
        .exec((err, user) => {
            if (err) {
                res.render('register', {message: "An error occurred. Please try again."});
            } else if (user) {
                res.render('register', {message: "User Already Exists! Login or choose another email."});
            } else {
                // else, if everything checks out, save user to session and
                // redirect to dashboard
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    names: req.body.names,
                    password: req.body.password,
                    phone: req.body.phone,
                });
        
                newUser.save((err, newUser) => {
                    if (err) {
                        res.render('register', {message: err});
                    } else {
                        req.session.user = newUser;
                        res.redirect('/dashboard');
                    }
                });
            }
        });
    }

});

// GET login
router.get('/login', function(req, res){
    res.render('login');
});

// POST login
router.post('/login', function(req, res){
    // validate input
    if(checkIfEmpty(req.body.username) || checkIfEmpty(req.body.password)){
        res.render('login', {message: "Please enter both username and password"});
    } else {
        // find existing user record
        User.findOne({
            username: req.body.username,
            password: req.body.password,
        })
        .exec((err, user) => {
            if (err) {
                res.render('login', {message: "Invalid credentials!"});
            } else if (! user) {
                res.render('login', {message: "Invalid credentials!"});
            } else {
                // else, if everything checks out, save user to session and
                // redirect to dashboard
                req.session.user = user;
                res.redirect('/dashboard');
            }
        });
    }

});

// GET logout
router.get('/logout', function(req, res){
    req.session.destroy(function(){
        console.log("user logged out.")
    });
    res.redirect('/login');
});

// GET dashboard
router.get('/dashboard', checkAuth, function(req, res){
    res.render('dashboard', {user: req.session.user})
});

module.exports = router
