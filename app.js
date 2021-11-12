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

// Enviroment Variables
const api = process.env.API_URL;
const dbConnect = process.env.DB_URL;


// ----- Middleware --- (function that has control of req, res of any API)
// Parse JSON 
app.use(express.json())

// For creating a file of API logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Using Morgan for logging API requests
app.use(morgan('tiny'))

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