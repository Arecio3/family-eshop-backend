const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv/config');
const mongoose = require('mongoose');

const api = process.env.API_URL;
const dbConnect = process.env.DB_URL;
// ----- Middleware --- (function that has control of req, res of any API)
// Parse JSON 
app.use(express.json())

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Using Morgan for logging API requests
app.use(morgan('tiny'))
// Morgan writes a file for API logs
app.use(morgan('combined', { stream: accessLogStream }))
// ----- End of Middleware -----

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number,
})

const Product = mongoose.model('Product', productSchema)

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
    // Creating new product with request from body of DOM
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    // Save to DB
    product.save().then((createdProduct => {
        // returns status and json obj of product
        res.status(201).json(createdProduct)
    })).catch((err) => {
        res.status(500).json({
            // usecase for stopping proccess
            error: err,
            success: false
        })
    })
})

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