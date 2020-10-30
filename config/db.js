const dbConfig = {
  url: "mongodb+srv://password-123:password-123@my-portfolio.5rwdw.mongodb.net/my-portfolio?retryWrites=true&w=majority",
};

const mongoose = require("mongoose");

// create a new db object
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require("../models/user.model")(mongoose);
db.contacts = require("../models/contact.model")(mongoose);
db.books = require("../models/book.model")(mongoose);

module.exports = db;