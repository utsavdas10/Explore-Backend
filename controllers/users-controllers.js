const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
let DUMMY_PLACES = require('../Dummy Data/users-data');


// -------------------------------------------CONTROLLERS-------------------------------------------------- //




// -------------------------------------------GET-------------------------------------------------- //

// api/users => GET [controller for getting all places]
const getAllUsers = (req, res, next) =>{
    if(!DUMMY_PLACES || DUMMY_PLACES.length === 0){
        throw new HttpError('Could not find any user', 404);
    }
    return res.json({DUMMY_PLACES});
};




// -------------------------------------------POST-------------------------------------------------- //

// api/users/signup => POST [controller for signing up a user]
const signup = (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data', 422);
    }

    const {name, email, password} = req.body;
    const hasUser = DUMMY_PLACES.find(user => user.email === email);
    if(hasUser){
        throw new HttpError('Could not create user, email already exists', 422);
    }
    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    };
    DUMMY_PLACES.push(createdUser);
    return res.status(201).json({user: createdUser});
};


// api/users/login => POST [controller for logging in a user]
const login = (req, res, next) =>{
    const {email, password} = req.body;
    const identifiedUser = DUMMY_PLACES.find(user => user.email === email);
    if(!identifiedUser){
        throw new HttpError('Could not identify user', 401);
    }
    else if(identifiedUser.password !== password){
        throw new HttpError(`Wrong password for ${identifiedUser.email}`, 401);
    }
    return res.json({message: 'Logged in!'});
};




// exporting controllers
module.exports = {
    getAllUsers,
    signup,
    login
}