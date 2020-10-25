var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares');
const db = require("../models");
const Users = db.users;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// GET about page
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

// GET portfolio page
router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', { title: 'Portfolio' });
});

// GET contact page
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

// GET services page
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});

// Download CV
router.get('/download-cv', function(req, res, next) {
  var fs = require("fs");

  var file = fs.createReadStream('./public/cv.pdf');
  var stat = fs.statSync('./public/cv.pdf');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
  file.pipe(res);
});

// POST signup 
router.get('/signup', function(req, res){
  res.render('signup');
});

// GET signup
router.post('/signup', function(req, res){
  if(!req.body.id || !req.body.password){
    res.status("400");
    res.send("Invalid details!");
  } else {
    Users.filter(function(user){
      if(user.id === req.body.id){
          res.render('signup', {
            message: "User Already Exists! Login or choose another user id"});
      }
    });
    var newUser = {id: req.body.id, password: req.body.password};
    Users.push(newUser);
    req.session.user = newUser;

    res.redirect('/dashboard');
  }
});

// GET login
router.get('/login', function(req, res){
  res.render('login');
});

// POST login
router.post('/login', function(req, res){
  if(!req.body.email || !req.body.password){
    res.render('login', {message: "Please enter both email and password"});
  } else {
    Users.findOne({
      email: req.body.email
    })
    .exec((err, user) => {
      if (err) {
        return res.render('login', {message: "Invalid credentials!"});
      }

      if (! user) {
        return res.render('login', {message: "Invalid credentials!"});
      }

      // else, if everything checks out, save user to session and
      // redirect to dashboard
      req.session.user = user;
        res.redirect('/dashboard');
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


module.exports = router;
