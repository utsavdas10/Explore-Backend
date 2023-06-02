const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');
let DUMMY_PLACES = require('../Dummy Data/users-data');



// -------------------------------------------GET-------------------------------------------------- //

// api/places => GET [controller for getting all places]
const getAllPlaces = (req, res, next) =>{

};



// -------------------------------------------POST-------------------------------------------------- //

// api/places/signup => POST [controller for signing up a user]
const signup = (req, res, next) =>{

};


// api/places/login => POST [controller for logging in a user]
const login = (req, res, next) =>{

};



module.exports = {
    getAllPlaces,
    signup,
    login
}