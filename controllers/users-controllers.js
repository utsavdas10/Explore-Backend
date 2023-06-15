// Third party imports
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Local imports
const HttpError = require('../models/http-error');
const User = require('../models/users');


// -------------------------------------------CONTROLLERS-------------------------------------------------- //




// -------------------------------------------GET-------------------------------------------------- //

// api/users => GET [controller for getting all places]
const getAllUsers = async (req, res, next) =>{
    let users;
    try{
        users = await User.find({}, '-password');
    }
    catch(err){
        const error = new HttpError('Fetching users failed, please try again later', 500);
        return next(error);
    }

    if(users.length === 0 || !users){
        const error = new HttpError('Could not find any users', 404);
        return next(error);
    }
    return res.json({users: users.map(user => user.toObject({getters: true}))});
};




// -------------------------------------------POST-------------------------------------------------- //

// api/users/signup => POST [controller for signing up a user]
const signup = async (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const err = new HttpError('Invalid inputs passed, please check your data', 422);
        return next(err);
    }

    const {name, email, password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }
    catch(err){
        const error = new HttpError('Signing up failed, please try again later', 500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError('User exists already, please login instead', 422);
        return next(error);
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }
    catch(err){
        const error = new HttpError('Could not create user, please try again', 500);
        return next(error);
    }

    createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    });
    try{
        await createdUser.save().then(() => console.log('User created!'));
    }
    catch(err){
        const error = new HttpError('Signing up failed, please try again later', 500);
        return next(error);
    }

    return res.status(201).json({
        message:"Signed in Successfuly",
        user: createdUser.toObject({getters: true})
    });
};



// api/users/login => POST [controller for logging in a user]
const login = async (req, res, next) =>{
    const {email, password} = req.body;

    let loginUser;
    try{
        loginUser = await User.findOne({email: email});
    }
    catch(err){
        const error = new HttpError('Logging in failed, please try again later', 500);
        return next(error);
    }

    if(!loginUser){
        const error = new HttpError('Invalid credentials, could not log you in', 401);
        return next(error);
    }

    if(!passwordMatch){
        const error = new HttpError('Invalid credentials, could not log you in', 401);
        return next(error);
    }

    let passwordMatch;
    try{
        passwordMatch = await bcrypt.compare(password, loginUser.password);
    }
    catch(err){
        const error = new HttpError('Could not log you in, please check your credentials and try again', 500);
        return next(error);
    }
    
    return res.json({
        message: 'Logged in!',
        user: loginUser.toObject({getters: true})
    });
};




// exporting controllers
module.exports = {
    getAllUsers,
    signup,
    login
}