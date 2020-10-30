var express = require('express')
var router = express.Router()
const db = require("../config/db");
const Contact = db.contacts;
const { checkAuth } = require('../middlewares');

// function to check if a variable is empty or null
// returns true if empty
const checkIfEmpty = (k) => {
    return !k || k.length < 1;
}

/* GET. */
router.get('/', function(req, res, next) {
    res.render('books/index');
});

// renders the book details page
/* GET. */
router.get('/add', function(req, res, next) {
    res.render('books/details', {
        title: 'Book Title',
        books: null,
    });
});

// processes the insertion of a new book 
/* POST. */
router.post('/add', function(req, res, next) {
    
    res.redirect('/books')
});

// renders the book details page
/* GET. */
router.get('/:id', function(req, res, next) {
    res.render('books/details', {
        title: 'Book Title',
        books: null,
    });
});

// processes the insertion of a new book 
/* POST. */
router.post('/:id', function(req, res, next) {
    
    res.redirect('/books')
});

//  processes the user’s delete request
/* GET. */
router.get('/delete/:id', function(req, res, next) {
    
    res.redirect('/books')
});

module.exports = router
