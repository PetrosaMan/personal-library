/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
//const bodyParser = require("body-parser");
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
      try {
      const arrayOfBooks = await Book.find();
        //return res.json(arrayOfBooks);
        let books= arrayOfBooks.map((book) => ({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));        
        res.json(books);                 
      } catch (err) {
          res.json({error: "%%Internal Server Error"});
        }            
    })
    .post(async function (req, res) {
      try {
      let title = req.body.title;     
      if (!title || title == '') { 
        return res.json("missing required field title");
      }      
        // create new book
        let newBook = new Book({
          title: title,
          comments: [],
          commentcount: 0,
        });         
        const result = await newBook.save();
        // respond with saved book
        //console.log('newBook ', result);
        res.json({
          comments: result.comments,          
          _id: result._id,
          title: result.title,
          commentcount: result.commentcount
         });
      } catch (err) {
        // Handle errors added 
        res.json("missing required field title");
      }
    })
    .delete(async function (req, res) {      
      // delete all books      
      try {
          await Book.deleteMany();                    
          res.json("complete delete successful");
          console.log("all books deleted");          
      } catch (err) {
          res.json({err:"Internal @@ server Error"});
      }
    });

  app
    .route("/api/books/:_id")
    .get( async function (req, res) {
      try {
      let bookid = req.params._id;      
      if(!bookid) {
          return res.json("no book exists");
      }
        const foundBook = await Book.findById(bookid);
        if(!foundBook) {
          return res.json("no book exists");
        }        
        return res.json({ 
          comments: foundBook.comments,
          _id: foundBook._id ,
          title: foundBook.title,          
          commentcount: foundBook.commentcount });
      } catch (err) {
          res.json( "no book exists" );
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      try {
      let bookid = req.params._id;
      let comment = req.body.comment;       
      if(!comment || comment == '') {
          return res.json("missing required field comment");
      }          
      const foundBook = await Book.findById(bookid);
        if (!foundBook) {
          return res.json("no book exists");          
        }
        // add comment  to array
        foundBook.comments.push(comment);
        // increment count 
        foundBook.commentcount = foundBook.comments.length;      
        // save updated book
        const book = await foundBook.save();
        res.json({ 
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.commentcount
           });
      } catch (err) {
        /// check if format ok in sending ALL fields back
        return res.json("no book exists");
      }      
      //json res format same as .get???
    })

    .delete( async function (req, res) {
      // if successful response: 'complete delete successful
      let bookid =req.params._id      
      console.log("bookId: ", bookid);
      try { 
        await Book.findByIdAndDelete(bookid)
        res.send("delete successful");
      } catch(err) {
        res.json("no book exists");
      }      
    });       
    
};
