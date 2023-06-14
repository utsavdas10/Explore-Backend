// Third-party imports
const express = require('express');
const {check} = require('express-validator');

// Local imports
const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middlewares/file-upload');

// Creating router
const router = express.Router();


// api/users => GET [ROUTE for getting all users]
router.get('/', usersControllers.getAllUsers);


// api/users/signup => POST [ROUTE for signing up a user]
router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(), // normalizeEmail() is used to convert the email to lowercase
        check('password').isLength({min: 6})
    ],
    usersControllers.signup
);


// api/users/login => POST [ROUTE for logging in a user]
router.post('/login', usersControllers.login);



// exporting router
module.exports = router;