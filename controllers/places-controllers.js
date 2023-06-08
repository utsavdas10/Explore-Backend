// Third party imports
const {v4: uuidv4} = require('uuid');
const {validationResult} = require('express-validator');

// Local imports
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
let DUMMY_PLACES = require('../Dummy Data/places-data');
const Place = require('../models/places');


// -------------------------------------------GET-------------------------------------------------- //

// api/places/:pid => GET [controller for getting a place by place id]
const getPlaceByPlaceId = (req, res, next) =>{  
    const placeId = req.params.pid;  
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if(!place){
        const error = new HttpError('Could not find a place for the provided place id', 404);
        return next(error);
    }
    return res.json({place});
};


// api/places/user/:uid => GET [controller for getting a place by user id]
const getPlacesByUserId = (req, res, next) =>{
    const userId = req.params.uid;
    const userPlaces = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    })

    if(userPlaces.length === 0 || !userPlaces){
        const error = new HttpError('Could not find a place for the provided user id', 404);
        return next(error);
    }
    return res.json({userPlaces});
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
            console.log(result);
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
const updatePlace = (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors); // for debugging
        throw new HttpError('Invalid inputs passed, please check your data', 422);
    }

    const placeId = req.params.pid;
    const {title, description} = req.body;

    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)}; // {...} is used to create a copy of the object
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    return res.status(200).json({place: updatedPlace});
};



// -------------------------------------------DELETE-------------------------------------------------- //

// api/places/:pid => DELETE [controller for deleting a place]
const deletePlace = (req, res, next) =>{
    const placeId = req.params.pid;
    
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Could not find a place for the provided place id', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
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