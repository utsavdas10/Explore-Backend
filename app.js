// Third party imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Local imports
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

//creating express app
const app = express(); 


//-----------------------Middlewares-----------------------//

// Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Routes middleware initialization
app.use('/api/places' ,placesRoutes);  
app.use('/api/users', usersRoutes);

// Page not found middleware
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error; 
});

// Error handling middleware
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});









const port = process.env.PORT || 5000;
const URL = "mongodb+srv://utsavdas10:utsavdas10@cluster0.p9102dl.mongodb.net/PlacesDB?retryWrites=true&w=majority"

// Server initialization
mongoose.connect(URL).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}....`);
    });
}).catch(err =>{
    console.log(err);
})


