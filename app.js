const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv/config');
const mongoose = require('mongoose');
const productRouter = require('./routers/products');

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

// Hooks up the routes 
app.use(`${api}/products`, productRouter)
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