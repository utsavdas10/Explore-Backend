// Third party imports
const express = require('express');
const bodyParser = require('body-parser');

// Local imports
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');


//creating express app
const app = express(); 


//-----------------------Middlewares-----------------------//

app.use(bodyParser.urlencoded({extended: true })); 
app.use(bodyParser.json());

// Routes middleware initialization
app.use('/api/places' ,placesRoutes);  
app.use(usersRoutes);


// Error handling middleware
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});








// Server initialization
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}....`);
});