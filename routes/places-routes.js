// Third party imports
const express = require('express');
const {check} = require('express-validator');
const checkAuth = require('../middlewares/check-auth');

// Local imports
const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middlewares/file-upload');

// Creating router
const router = express.Router();


// api/places/:pid => GET [ROUTE for getting a place by place id]
router.get('/:pid', placesControllers.getPlaceByPlaceId);


// api/places/user/:uid => GET [ROUTE for getting a place by user id]
router.get('/user/:uid', placesControllers.getPlacesByUserId);


// Authorizing all the routes below this middleware
router.use(checkAuth);



// -------------------------------Authorized Routes-------------------------------------- //


// api/places => POST [ROUTE for creating a place]
router.post(
    '/',
    fileUpload.single('image'),
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