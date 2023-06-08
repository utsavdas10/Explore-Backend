// Third party imports
const {v4: uuidv4} = require('uuid');
const {validationResult} = require('express-validator');

// Local imports
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/places');


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

    res.json({place: place});
};


// api/places/user/:uid => GET [controller for getting a place by user id]
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
    return res.json({places: userPlaces});
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

    let coordinatesFromAddress;
    try{
        coordinatesFromAddress = await getCoordsForAddress(address); // this is a promise
    }
    catch(error){
        return next(error);
    } 

    const createdPlace = new Place({
        title,
        description,
        location: coordinatesFromAddress,
        address,
        image: 'https://www.fcbarcelona.com/fcbarcelona/photo/2020/02/24/3f1215ed-07e8-47ef-b2c7-8a519f65b9cd/mini_UP3_20200105_FCB_VIS_View_1a_Empty.jpg',
        creator
    });

    try{
        createdPlace.save().then(result => {
            console.log("Place created successfully");
        });
    }
    catch(error){
        const err = new HttpError('Creating place failed, please try again', 500);
        return next(err);
    }

    return res.status(201).json({place: createdPlace});
};




// -------------------------------------------PATCH-------------------------------------------------- //

// api/places/:pid => PATCH [controller for updating a place]
const updatePlace = async (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors); // for debugging
        throw new HttpError('Invalid inputs passed, please check your data', 422);
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

    return res.status(200).json({place: updatePlace});
};




// -------------------------------------------DELETE-------------------------------------------------- //

// api/places/:pid => DELETE [controller for deleting a place]
const deletePlace = (req, res, next) =>{
    const placeId = req.params.pid;
    
    try{
        Place.findByIdAndDelete(placeId).then(() => {
            console.log('Place deleted successfully');
        });
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }

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