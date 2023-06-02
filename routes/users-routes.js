// Third-party imports
const express = require('express');

// Local imports
const usersControllers = require('../controllers/users-controllers');

// Creating router
const router = express.Router();


// api/users => GET [ROUTE for getting all users]
router.get('/', usersControllers.getAllUsers);


// api/users/signup => POST [ROUTE for signing up a user]
router.post('/signup', usersControllers.signup);


// api/users/login => POST [ROUTE for logging in a user]
router.post('/login', usersControllers.login);



// exporting router
module.exports = router;