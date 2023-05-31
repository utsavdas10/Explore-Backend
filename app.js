// Third party imports
const express = require('express');
const bodyParser = require('body-parser');

// Local imports
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');


//creating express app
const app = express(); 

//Middlewares
app.use(bodyParser.urlencoded({extended: true })); 
app.use(bodyParser.json());

app.use('/api/places' ,placesRoutes);  
// app.use(usersRoutes);











const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}....`);
});