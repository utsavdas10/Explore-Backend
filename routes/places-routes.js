const express = require('express');

const DUMMY_PLACES = require('../Dummy Data/places-data');

const router = express.Router();


router.get('/:pid', (req, res, next) =>{  
    const placeId = req.params.pid;  
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    !place ?
        res.status(404).json({message: 'Could not find a place for the provided id'}) 
        : res.json({place});
});


module.exports = router;