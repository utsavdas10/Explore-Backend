// Node imports
const fs = require('fs');

// Third party imports
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

// Local imports
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/places');
const User = require('../models/users');


// -------------------------------------------CONTROLLERS-------------------------------------------------- //




// -------------------------------------------GET-------------------------------------------------- //

// api/places/:pid => GET [controller for getting a place by place id]
const getPlaceByPlaceId = async (req, res, next) =>{  
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId)
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not find a place', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find a place for the provided place id', 404);
        return next(error);
    }

    res.json({place: place.toObject({getters: true})});
};



// api/places/user/:uid => GET [controller for getting places by user id]
const getPlacesByUserId = async (req, res, next) =>{
    const userId = req.params.uid;

    let userPlaces;
    try{
        userPlaces = await Place.find({creator: userId});
    }
    catch(err){
        const error = new HttpError('Fetching places failed, please try again later', 500);
        return next(error);
    }
    
    if(userPlaces.length === 0 || !userPlaces){
        const error = new HttpError('Could not find a place for the provided user id', 404);
        return next(error);
    }
    return res.json({places: userPlaces.map(place => place.toObject({getters: true}))});

    // let userWithPlaces;
    // try{
    //     userWithPlaces = await User.findById(userId).populate('places');
    // }
    // catch(err){
    //     const error = new HttpError('Fetching places failed, please try again later', 500);
    //     return next(error);
    // }

    // if(!userWithPlaces || userWithPlaces.places.length === 0){
    //     const error = next(new HttpError('Could not find a place for the provided user id', 404));
    //     return next(error);
    // }

    // return res.json({places: userWithPlaces.places.map(place => place.toObject({getters: true}))});
};




// -------------------------------------------POST-------------------------------------------------- //

// api/places => POST [controller for creating a place]
const createPlace = async (req, res, next) =>{ 
    
    const errors = validationResult(req);            
    if(!errors.isEmpty()){
        console.log(errors); // for debugging
        return next(
            new HttpError('Invalid inputs passed, please check your data', 422)
        ); 
    }

    const {title, description, address, creator} = req.body;

    let user;
    try{
        user = await User.findById(creator);
    }
    catch(err){
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    if(!user){
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    let coordinatesFromAddress;
    try{
        coordinatesFromAddress = await getCoordsForAddress(address);
    }
    catch(error){
        return next(error);
    } 

    const createdPlace = new Place({
        title,
        description,
        location: coordinatesFromAddress,
        address,
        image: req.file.path,
        creator
    });

    try{
        // session is used to make sure that if one fails, the other one fails too
        // if one fails, the other one will not be executed
        // this is to make sure that if the place is not created, the user will not be created and vice versa
        // if one fails, the changes are rolled back

        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess}); 
        user.places.push(createdPlace); // mongoose will automatically extract the id from the place
        await user.save({session: sess}); 
        await sess.commitTransaction().then(() => {
            console.log('Place created successfully');
        }); // if both are successful, the changes are saved to the 
        
    }
    catch(error){
        const err = new HttpError('Creating place failed, please try again', 500);
        return next(err);
    }

    return res.status(201).json({place: createdPlace.toObject({getters: true})});
};




// -------------------------------------------PATCH-------------------------------------------------- //

// api/places/:pid => PATCH [controller for updating a place]
const updatePlace = async (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors); // for debugging
        const err = new HttpError('Invalid inputs passed, please check your data', 422);
        return next(err);
    }

    const placeId = req.params.pid;
    const {title, description} = req.body;
    
    let updatePlace;
    try{
        updatePlace = await Place.findById(placeId);
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    if(!updatePlace){
        const error = new HttpError('Could not find a place for the provided place id', 404);
        return next(error);
    }

    updatePlace.title = title;
    updatePlace.description = description;
    try{
        await updatePlace.save().then(() => {
            console.log('Place updated successfully');
        })
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    return res.status(200).json({place: updatePlace.toObject({getters: true})});
};




// -------------------------------------------DELETE-------------------------------------------------- //

// api/places/:pid => DELETE [controller for deleting a place]
const deletePlace = async (req, res, next) =>{
    const placeId = req.params.pid;
    
    let place;
    try{
        place = await Place.findById(placeId).populate('creator');
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find a place for the provided place id', 404);
        return next(error);
    }

    const imagePath = updatePlace.image;

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();    
        await Place.findByIdAndDelete(placeId, {session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction().then(() => {
            console.log('Place deleted successfully');
        });
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });

    return res.status(200).json({message: 'Place deleted successfully'});
};




// Exporting controllers
module.exports = {
    getPlaceByPlaceId,
    getPlacesByUserId,
    createPlace,
    updatePlace,
    deletePlace
}