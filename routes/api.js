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
  comments: [String],
  commentcount: Number,
});

// define mongoose model
const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      let arrayOfBooks;
      await Book.find({}).then((arrayOfBooks) => {
        return res.json(arrayOfBooks);
      });
    })
    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.json("missing required field title");
      }
      if (await Book.exists({ title: title })) {
        return res
          .status(400)
          .json({ error: title + " already exists in library" });
      }
      try {
        // create new book
        let newBook = new Book({
          title: title,
          comments: [],
          commentcount: 0,
        });
        await newBook.save();
        // respond with saved book
        return res.status(200).json({ title: newBook.title, _id: newBook._id });
      } catch {
        // Handle errors
        res.status(500).json({ error: "Internal server error" });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      console.log("route/api/books", "delete req");

    });

  app
    .route("/api/books/:id")
    .get( async function (req, res) {
      let bookid = req.params.id;
      try {
        const foundBook = await Book.findById(bookid);
        if(!foundBook) {
          return res.json("No book exists");
        }
        return res.json( foundBook );
      } catch (error) {
          res.json("error");
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //console.log('Comment: ',comment);
      //console.log(bookid);       
      try {  
        if(!comment) {
          return res.json("missing required field comment")
        }  
        const foundBook = await Book.findById(bookid);
        if (!foundBook) {
          return res.json("no book exists");          
        }
        foundBook.comments.push(comment); // add comment
        foundBook.commentcount += 1;      // increment count
        // save updated book
        const updatedBook = await foundBook.save();
        return res.json({ updatedBook });
      } catch (error) {
         res.json("error updating book");
      }      
      //json res format same as .get
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;      
      try {
        await Book.deleteOne({_id: bookid});
        res.json('delete successful');
      } catch (error) {
        res.json('no book found'); 
      }
    });
};
