/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let id;

suite('Functional Tests', function() {  
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)                       
      .get('/api/books')      
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });

  /*
  * ----[END of EXAMPLE TEST]----
  */      
        
  suite('Routing tests', function() { 
       
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .keepOpen()
        .post('/api/books')
        .send({ title: 'test-title' })
        .end(function(err, res) {                     
          assert.equal(res.status, 200);
          //console.log('res.body ** ', res.body); 
          assert.equal(res.body.title, 'test-title');          
          id = res.body._id;
          //console.log('title:', res.body.title)
          //console.log('id has been set as ' + id);
          //console.log('comCount ', res.body.commentcount);
          done();
        });              
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .keepOpen()
        .post("/api/books")
        .send({})
        .end(function(err, res) {           
          assert.equal(res.status, 200);                              
          assert.equal(res.body, 'missing required field title');
          done();
        });                       
      }); 

    });
    
    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books', function(done){
        chai.request(server)
        .keepOpen()
        .get("/api/books")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Book should contain commentcount');
          assert.property(res.body[0], 'title', 'Book should contain title');
          assert.property(res.body[0], '_id', 'Book should contain _id');
          done();
        });        
      });      
    });  
    
    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
       const _id = "123456"; // false id
        chai
        .request(server)
        .keepOpen()
        .get("/api/books/" + _id) 
        .end( function(err, res) {                                      
          assert.equal(res.status, 200);          
          assert.equal(res.text, '"no book exists"');          
          done();  
        });        
      });  
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .keepOpen()        
        .get("/api/books/" + id) 
        .end( function(err, res) {                                
          assert.equal(res.status, 200);          
          assert.equal(res.body._id, id); 
          //console.log('id = ', id)         
          assert.equal(res.body.title, 'test-title')
          assert.isArray(res.body.comments, 'response should be an array');                            
          done();
        });        
      });      
    });

     suite('POST /api/books/[id] => add comment/expect book object with id', function(){
          
      test('Test POST /api/books/[id] with comment', function(done){                
        //console.log('id = ', id);        
        chai.request(server)
        .keepOpen()        
        .post("/api/books/" + id)                
        .send({comment: "test-comment" }) 
        .end( function(err, res) { 
          //console.log('post comment response');                             
          assert.equal(res.status, 200);
          //console.log('comments',res.body.comments);
          //console.log('res.body = ', res.body)
          assert.include(res.body.comments, 'test-comment');                        
         done();
        });
      });
    }); 
      
      test('Test POST /api/books/[id] without comment field', function(done){
        const bookId = id;
        chai.request(server)
        .keepOpen()        
        .post("/api/books/" + id)                
        .send({}) 
        .end( function(err, res) {
          assert.equal(res.status, 200); 
          assert.equal(res.body, "missing required field comment");                    
          done();
        });        
      });
      

      
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const invalidID = "12345" // not in db
        chai
        .request(server)
        .keepOpen()        
        .post("/api/books/" + invalidID)               
        .send({comment: "test-comment" })
        .send({_id: invalidID})        
        .end( function(err, res) {           
          assert.equal(res.status, 500);
          const responseBody = JSON.parse(res.text);
          assert.equal(responseBody.error, "an error occurred while updating the book");            
         done();
        });         
      });      
    })    

     suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .keepOpen()        
        .delete("/api/books/" + id)         
        .end( function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "delete successful");
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const invalidId = "123456"
        chai
        .request(server)
        .keepOpen()                
        .delete("/api/books/" + invalidId)         
        .end( function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "no book exists");
        done();
      });
    });
  }); 
  }); 
});

