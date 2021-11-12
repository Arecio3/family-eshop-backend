const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// get all products route
router.get(`/`, async (req, res) => {
    const productList = await Product.find()
    // If theres no products
    if (!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList);
})
// post product route
router.post(`/`, (req, res) => {
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

module.exports = router;
