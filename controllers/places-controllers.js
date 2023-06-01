const HttpError = require('../models/http-error');
const DUMMY_PLACES = require('../Dummy Data/places-data');


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
    return res.json(place);
}


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
    return res.json(userPlaces);
}



// Exporting controllers
module.exports = {
    getPlaceByPlaceId,
    getPlacesByUserId
}