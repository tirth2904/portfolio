var express = require('express');
var router = express.Router();
const { checkAuth } = require('../middlewares');
const db = require("../models");
const User = db.users;
const Contact = db.contacts;

// function to check if a variable is empty or null
// returns true if empty
const checkIfEmpty = (k) => {
  return !k || k.length < 1;
}

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

// GET contact-list
router.get('/contact-list', checkAuth, function(req, res){
  Contact.find({}).sort({"name": 1})
  .then(list => {
    res.render('contact-list/index', {
      user: req.session.user,
      list: list,
    })
  })
});

// GET contact-list-create
router.get('/contact-list-create', checkAuth, function(req, res){
  res.render('contact-list/create', {user: req.session.user})
});

// GET contact-list-edit
router.get('/contact-list-edit/:id', checkAuth, function(req, res){
  Contact.findById(req.params.id).lean()
  .exec((err, item) => {
    if (err) {
      res.render('contact-list/index', {message: err});
    } else {
      res.render('contact-list/edit', {
        user: req.session.user,
        item: item,
      })
    }
  });

});

// POST contact-list
router.post('/contact-list', function(req, res){
  // validate input
  if(
    checkIfEmpty(req.body.contact_name) || 
    checkIfEmpty(req.body.contact_email) || 
    checkIfEmpty(req.body.contact_number)
  )
  {
    res.render('contact-list/create', {message: "Please enter all fields"});
  } else {
    // add new record
    const newContact = new Contact({
      name: req.body.contact_name,
      number: req.body.contact_number,
      email: req.body.contact_email,
    });
  
    newContact.save((err, newContact) => {
      if (err) {
        res.render('contact-list/create', {message: err});
      } else {
        res.redirect('contact-list');
      }
    });
  }

});

// POST contact-list update
router.post('/contact-list/:id', function(req, res){
  // validate input
  const id = req.params.id;
  if(
    checkIfEmpty(req.body.contact_name) || 
    checkIfEmpty(req.body.contact_email) || 
    checkIfEmpty(req.body.contact_number)
  )
  {
    res.render('contact-list/response', {
      message: `Please provide all fields`,
      alert: 'danger'
    });
  } else {
    const dt = {
      name: req.body.contact_name,
      number: req.body.contact_number,
      email: req.body.contact_email,
    };

    Contact.findByIdAndUpdate(id, dt, { useFindAndModify: false, new: true })
      .then(data => {
        if (! data) {
          res.render('contact-list/response', {
            message: `Cannot update item with id=${id}. Maybe it was not found!`,
            alert: 'danger'
          });
        } else {
          res.redirect('/contact-list');
        }
      })
      .catch(err => {
        res.render('contact-list/response', {
          message: `Error updating item with id=${id}`,
          alert: 'danger'
        });
      });
  }

});

// GET contact-list-delete
router.get('/contact-list-delete/:id', checkAuth, function(req, res){
  Contact.findByIdAndRemove(req.params.id)
  .then(data => {
    if (! data) {
      res.render('contact-list/response', {
        message: `Cannot delete item with id=${id}. Maybe it was not found!`,
        alert: 'danger'
      });
    } else {
      res.redirect('/contact-list');
    }
  })
  .catch(err => {
    res.render('contact-list/response', {
      message: `Error deleting item with id=${id}`,
      alert: 'danger'
    });
  });

});

module.exports = router;
