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
      } catch (error) {
          res.json({error: "%%Internal Server Error"});
        }            
    })
    .post(async function (req, res) {
      
      let title = req.body.title;     
      if (!title || title == '') { 
        return res.json("missing required field title");
      }
      try {      
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
          //console.log("all books deleted");          
      } catch (err) {
          res.json({err:"Internal @@ server Error"});
      }
    });

  app
    .route("/api/books/:_id")
    .get( async function (req, res) {     
      let bookid = req.params._id;      
      if(!bookid) {
          return res.json("no book exists");
      }
      try {
        const foundBook = await Book.findById(bookid);
        if(!foundBook) {
          return res.json("no book exists");
        }        
        return res.json({ 
          comments: foundBook.comments,
          _id: foundBook._id ,
          title: foundBook.title,          
          commentcount: foundBook.commentcount });
      } catch (error) {
          res.json( "no book exists" );
      }      
    })

    .post(async function (req, res) {
      
      let bookid = req.params._id;
      let comment = req.body.comment; 

      if(!comment || comment.trim() === '') {
          return res.json("missing required field comment");
      }
      try {          
      const foundBook = await Book.findById(bookid);
        if (!foundBook) {
          return res.json("no book exists");          
        }

        // add comment  to array
        foundBook.comments.push(comment);

        // increment count 
        foundBook.commentcount = foundBook.comments.length;

        // save updated book
        const updatedBook = await foundBook.save();

        // Respond with updated book details
        res.json({           
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments,
          commentcount: updatedBook.commentcount
           });
      } catch (error) {
        // handle any errors  that occur during the process
        return res.status(500).json({ error: "an error occurred while updating the book"});
      }       
    })

    .delete( async function (req, res) {
      // if successful response: 'delete successful'
      const bookid =req.params._id;      
      if(!bookid) {
        return res.send('no book exists');
      } 
      try {
      const result = await Book.deleteOne({ _id: bookid });
        if (result.deletedCount === 0) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (error) {
        res.send('Error deleting book');
      }           
    });      
    
};
