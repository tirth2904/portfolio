var express = require('express')
var router = express.Router()
const db = require("../config/db");
const Model = db.books;
const { checkAuth } = require('../middlewares');

// function to check if a variable is empty or null
// returns true if empty
const checkIfEmpty = (k) => {
    return !k || k.length < 1;
}

/* GET. */
router.get('/', checkAuth, function(req, res, next) {
    Model.find({}).sort({"title": 1})
    .then(list => {
        res.render('books/index', {
            user: req.session.user,
            list: list,
            title: "Books",
        })
    })
});

// renders the book details page
/* GET. */
router.get('/add', checkAuth, function(req, res, next) {
    res.render('books/details', {
        title: 'Book Title',
        books: null,
    });
});

// processes the insertion of a new book 
/* POST. */
router.post('/add', checkAuth, function(req, res, next) {
    // validate input
    if(
        checkIfEmpty(req.body.title) || 
        checkIfEmpty(req.body.author) || 
        checkIfEmpty(req.body.pages) || 
        checkIfEmpty(req.body.isbn)
    )
    {
        res.render('books/details', {
            message: "Please enter all fields",
            title: "Add a New Book",
        });
    } else {
        // add new record
        const newItem = new Model({
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            isbn: req.body.isbn,
        });
    
        newItem.save((err, newItem) => {
            if (err) {
                res.render('books/details', {
                    message: err,
                    title: newItem.title
                });
            } else {
                res.redirect('/books')
            }
        });
    }

});

// renders the book details page
/* GET. */
router.get('/:id', checkAuth, function(req, res, next) {
    Model.findById(req.params.id).lean()
    .exec((err, item) => {
        if (err) {
            res.render('books/index', {
                message: err,
                title: "Books List",
            });
        } else {
            res.render('books/edit', {
                user: req.session.user,
                title: item.title,
                book: item,
            })
        }
    });

});

// processes the insertion of a new book 
/* POST. */
router.post('/:id', checkAuth, function(req, res, next) {
    // validate input
    const id = req.params.id;
    if(
        checkIfEmpty(req.body.title) || 
        checkIfEmpty(req.body.author) || 
        checkIfEmpty(req.body.pages) || 
        checkIfEmpty(req.body.isbn)
    )
    {
        res.render('books/response', {
            message: `Please provide all fields`,
            alert: 'danger'
        });
    } else {
        const dt = {
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            isbn: req.body.isbn,
        };

        Model.findByIdAndUpdate(id, dt, { useFindAndModify: false, new: true })
            .then(data => {
            if (! data) {
                res.render('books/response', {
                    message: `Cannot update item with id=${id}. Maybe it was not found!`,
                    alert: 'danger'
                });
            } else {
                res.redirect('/books');
            }
            })
            .catch(err => {
                res.render('books/response', {
                    message: `Error updating item with id=${id}`,
                    alert: 'danger'
                });
            });
        }

});

//  processes the user’s delete request
/* GET. */
router.get('/delete/:id', checkAuth, function(req, res, next) {
    Model.findByIdAndRemove(req.params.id)
    .then(data => {
        if (! data) {
            res.render('books/response', {
                message: `Cannot delete item with id=${id}. Maybe it was not found!`,
                alert: 'danger'
            });
        } else {
            res.redirect('/books');
        }
    })
    .catch(err => {
        res.render('books/response', {
            message: `Error deleting item with id=${id}`,
            alert: 'danger'
        });
    });

});

module.exports = router
