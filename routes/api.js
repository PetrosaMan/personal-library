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
      try {
      let arrayOfBooks;
      await Book.find().then((arrayOfBooks) => {
        //return res.json(arrayOfBooks);
        let books=[];
        for (const {title, _id, commentcount} of arrayOfBooks) {
          books.push({ title, _id, commentcount });
        };
        res.json(books);
        return;
      }); 
    } catch (err) {
        res.json([]);
    }            
    })
    .post(async function (req, res) {
      let title = req.body.title;
      if (!title || title == '') { 
        return res.json("missing required field title");
      }
      //Not asked for by FCC project so maybe leave it out?
      if (await Book.exists({ title: title })) {
        return res.json("title already exists" );
      }      
        // create new book
        let newBook = new Book({
          title: title,
          comments: [],
          commentcount: 0,
        });
        try {
        const result = await newBook.save();
        // respond with saved book
        res.json({ title: result.title, _id: result._id });
      } catch (err) {
        // Handle errors
        res.status(500).send({ error: "book POST error" });
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      // delete all books
      try {
          const deletedAllBooks = await Book.deleteMany();
          console.log("deleted all books", deletedAllBooks);          
            res.send('complete delete successful');          
      } catch (err) {
          res.send("err")
      }
    });

  app
    .route("/api/books/:id")
    .get( async function (req, res) {
      let bookid = req.params.id;
      try {
        if( bookid == '' || !bookid) {
          return res.json("no book exists");
        }
        const foundBook = await Book.findById(bookid);
        if(!foundBook) {
          return res.json('no book exists');
        }        
        return res.json( foundBook );
      } catch (error) {
          res.status(500).json("api/book/:id get error");
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;       
      if(!comment || comment == '') {
          return res.json("missing required field comment")
      }
      try {    
        const foundBook = await Book.findById(bookid);
        if (!foundBook) {
          return res.json("no book exists");          
        }
        // add comment  to array
        foundBook.comments.push(comment);
        // increment count 
        foundBook.commentcount += 1;      
        // save updated book
        const updatedBook = await foundBook.save();
        res.json({ updatedBook });
      } catch (error) {
        /// check if format ok in sending ALL fields back
         res.send("no book exists");
      }      
      //json res format same as .get???
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      console.log("delete book: ", bookid);     
      try {
        // maybe delete the if an just use the catch??
        if(!bookid || bookid == '') {
          return res.json('no book exists');
        }
        // check the format of the parameter required in deleteOne
        const result = await Book.deleteOne({_id: bookid});
        // maybe try : if(result) { res.json('delete successful)} else { res.json('no bokk exists')}
        res.send('delete successful');
      } catch (error) {
        res.send('no book exists'); 
      }
    });
};
