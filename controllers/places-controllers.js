const {v4: uuidv4} = require('uuid');

const HttpError = require('../models/http-error');
let DUMMY_PLACES = require('../Dummy Data/places-data');



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
const createPlace = (req, res, next) =>{
    const {title, description, coordinates, address, creator} = req.body;
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace);

    return res.status(201).json({place: createdPlace});
};



// -------------------------------------------PATCH-------------------------------------------------- //

// api/places/:pid => PATCH [controller for updating a place]
const updatePlace = (req, res, next) =>{
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