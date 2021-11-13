const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv/config');
const mongoose = require('mongoose');
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders');
const usersRouter = require('./routers/users');
const categoriesRouter = require('./routers/categories');
const cors = require('cors');
const authJwt = require('./helpers/jwt');

// Enviroment Variables
const api = process.env.API_URL;
const dbConnect = process.env.DB_URL;

// So we can make req from another origin
app.use(cors());
// Allows any origin to do http req
app.options('*', cors());

// ----- Middleware --- (function that has control of req, res of any API)
// Parse JSON 
app.use(express.json())

// For creating a file of API logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Using Morgan for logging API requests
app.use(morgan('tiny'))

// Using JWT Authentication
app.use(authJwt())

//API Error handling  
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: "The user is not authorized"})
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).json({message: err})
    }

    // default to 500 server error
    return res.status(500).json(err);

})

// Morgan writes a file for API logs
app.use(morgan('combined', { stream: accessLogStream }))

// Hooks up the Routers 
app.use(`${api}/products`, productsRouter)
app.use(`${api}/orders`, ordersRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/categories`, categoriesRouter)
// ----- End of Middleware -----


// Connect DB
mongoose.connect(dbConnect)
// On Success
.then(() => {
    console.log('Database Connection Successful !')
})
// On Failure
.catch((err) => {
    console.log(err)
})

// Run server with msg on success
app.listen(3000, () => {
    console.log(api);
    console.log('Backend Server running on http://localhost:3000');
})