// Third party imports
const express = require('express');

// Local imports
const placesControllers = require('../controllers/places-controllers');

// Creating router
const router = express.Router();


// api/places/:pid => GET [ROUTE for getting a place by place id]
router.get('/:pid', placesControllers.getPlaceByPlaceId);


// api/places/user/:uid => GET [ROUTE for getting a place by user id]
router.get('/user/:uid', placesControllers.getPlacesByUserId);


// api/places => POST [ROUTE for creating a place]
router.post('/', placesControllers.createPlace);


// exporting router
module.exports = router;