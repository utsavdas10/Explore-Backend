// Third party imports
const express = require('express');
const {check} = require('express-validator');

// Local imports
const placesControllers = require('../controllers/places-controllers');

// Creating router
const router = express.Router();


// api/places/:pid => GET [ROUTE for getting a place by place id]
router.get('/:pid', placesControllers.getPlaceByPlaceId);


// api/places/user/:uid => GET [ROUTE for getting a place by user id]
router.get('/user/:uid', placesControllers.getPlacesByUserId);


// api/places => POST [ROUTE for creating a place]
router.post(
    '/',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ],
    placesControllers.createPlace
);


// api/places/:pid => PATCH [ROUTE for updating a place]
router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5})
    ],
    placesControllers.updatePlace
);


// api/places/:pid => DELETE [ROUTE for deleting a place]
router.delete('/:pid', placesControllers.deletePlace);



// exporting router
module.exports = router;