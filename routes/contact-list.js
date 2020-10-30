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

// GET
router.get('/', checkAuth, function(req, res){
    Contact.find({}).sort({"name": 1})
    .then(list => {
        res.render('contact-list/index', {
            user: req.session.user,
            list: list,
            title: "Contact List",
        })
    })
});

// GET
router.get('/create', checkAuth, function(req, res){
    res.render('contact-list/create', {
        user: req.session.user,
        title: "Add a New Contact List",
    })
});

// GET
router.get('/:id', checkAuth, function(req, res){
    Contact.findById(req.params.id).lean()
    .exec((err, item) => {
        if (err) {
            res.render('contact-list/index', {
                message: err,
                title: "Contact List",
            });
        } else {
            res.render('contact-list/edit', {
                user: req.session.user,
                item: item,
                title: item.name,
            })
        }
    });

});
    
// POST 
router.post('/', function(req, res){
    // validate input
    if(
        checkIfEmpty(req.body.contact_name) || 
        checkIfEmpty(req.body.contact_email) || 
        checkIfEmpty(req.body.contact_number)
    )
    {
        res.render('contact-list/create', {
            message: "Please enter all fields",
            title: "Add a New Contact List",
        });
    } else {
        // add new record
        const newContact = new Contact({
            name: req.body.contact_name,
            number: req.body.contact_number,
            email: req.body.contact_email,
        });
    
        newContact.save((err, newContact) => {
            if (err) {
                res.render('contact-list/create', {
                    message: err,
                    title: newContact.name
                });
            } else {
                res.redirect('contact-list');
            }
        });
    }

});

// POST - update
router.post('/:id', function(req, res) {
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
    
// GET 
router.get('/delete/:id', checkAuth, function(req, res){
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

module.exports = router
