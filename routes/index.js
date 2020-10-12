var express = require('express');
var router = express.Router();

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

module.exports = router;
