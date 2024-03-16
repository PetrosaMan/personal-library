/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Connect mongoose to mongoDB
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  });

// mongoose bookSchema
const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [Number],
});

// define mongoose model
const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };

module.exports = function (app) {
  app
    .route("/api/books")
    .get( async function (req, res) { 
      let arrayOfBooks;      
      await Book.find({})
      .then((arrayOfBooks) => {        
          return res.json(arrayOfBooks);
      });               
      
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })     

    .post( async function (req, res) {
      let title = req.body.title;
      //console.log('new title: ', req.body.title);

      if (await Book.exists({title: title})) {
        return res.json({ error: title + " already exists in library" });
      }
      
     try {
        // create new book
        let newBook = new Book ({
          title: title,
          comments:[]
        });
        // save new book
        await newBook.save();
        // respond with saved book
        return res.json(newBook);
     } catch {
        // Handle errors
        res.status(500).json({ error: "string missing required field title"});
     }       
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
