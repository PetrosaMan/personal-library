# Personal Library

Build a full stack JavaScript app that is functionally similar to this: https://personal-library.freecodecamp.rocks/. Working on this project will involve you writing your code using one of the following methods:

	Ø Clone this https://github.com/freeCodeCamp/boilerplate-project-library GitHub repo and complete your project locally.

	Ø Use our   https://gitpod.io/?autostart=true#https://github.com/freeCodeCamp/boilerplate-project-libraryGitpod starter project to complete your project.

	Ø Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

	1. Add your MongoDB connection string to .env without quotes as DB Example: DB=mongodb://admin:pass@1234.mlab.com:1234/fccpersonallib
	2. In your .env file set NODE_ENV to test, without quotes
	3. You need to create all routes within routes/api.js
	4. You will create all functional tests in tests/2_functional-tests.js

Solution Link
ex: https://3000-project-url.gitpod.io/

Source Code Link
ex: https://your-git-repo.url/files

Get a Hint

Ask for Help

/**
*
* Your test output will go here
*
*
*/


Tests
	► Waiting:You can provide your own project, not the example URL.

	► Waiting:You can send a POST request to /api/books with title as part of the form data to add a book. The returned response will be an object with the title and a unique _id as keys. If title is not included in the request, the returned response should be the string missing required field title.

	►  You can send a GET request to /api/books and receive a JSON response representing all the books. The JSON response will be an array of objects with each object (book) containing title, _id, and commentcount properties.

	► You can send a GET request to /api/books/{_id} to retrieve a single object of a book containing the properties title, _id, and a comments array (empty array if no comments present). If no book is found, return the string no book exists.

	► You can send a POST request containing comment as the form body data to /api/books/{_id} to add a comment to a book. The returned response will be the books object similar to GET /api/books/{_id} request in an earlier test. If comment is not included in the request, return the string missing required field comment. If no book is found, return the string no book exists.

	► You can send a DELETE request to /api/books/{_id} to delete a book from the collection. The returned response will be the string delete successful if successful. If no book is found, return the string no book exists.

	► You can send a DELETE request to /api/books to delete all books in the database. The returned response will be the string complete delete successful if successful.


All 10 functional tests required are complete and passing.![image](https://github.com/PetrosaMan/personal-library/assets/61965099/fed0254e-2d52-4365-b712-07af94c6c51a)

