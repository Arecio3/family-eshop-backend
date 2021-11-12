const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv/config');
const api = process.env.API_URL;

// ----- Middleware --- (function that has control of req, res of any API)
// Parse JSON 
app.use(express.json())

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Using Morgan for logging API requests
app.use(morgan('tiny'))
// Morgan writes a file for API logs
app.use(morgan('combined', { stream: accessLogStream }))
// ----- End of Middleware -----

// get product route = http://localhost:3000/api/v1/products
app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'hair-dresser',
        image: "some_url"
    }
    res.send(product);
})
// specify inital route = http://localhost:3000/api/v1/products
app.post(`${api}/products`, (req, res) => {
    // grabs data from DOM body
    const newProduct = req.body;
    console.log(newProduct)
    // Sends to frontend
    res.send(newProduct);
})

// Run server with msg on success
app.listen(3000, () => {
    console.log(api);
    console.log('Backend Server running on http://localhost:3000');
})