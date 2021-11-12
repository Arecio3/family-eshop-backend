const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');

router.get(`/`, async (req, res) => {
    const orderList = await Order.find();

    if (!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

// // get all products route
// router.get(`/`, async (req, res) => {
//     const orderList = await Order.find()
//     // If theres no products
//     if (!orderList) {
//         res.status(500).json({success: false})
//     }
//     res.send(orderList);
// })
// // post product route
// router.post(`/`, (req, res) => {
//     // Creating new product with request from body of DOM
//     const order = new Order({
//         orderItems: req.body.OrderItems,
//         shippingAddress1: req.body.shippingAddress1,
//         shippingAddress2: req.body.shippingAddress2,
//         city: req.body.city,
//         zip: req.body.zip,
//         country: req.body.country,
//         phone: req.body.phone,
//         totalPrice: req.body.totalPrice,
//         user: req.body.user,
//         date: Date,
//     })

//     // Save to DB
//     order.save().then((createdOrder => {
//         // returns status and json obj of product
//         res.status(201).json(createdOrder)
//     })).catch((err) => {
//         res.status(500).json({
//             // usecase for stopping proccess
//             error: err,
//             success: false
//         })
//     })
// })

module.exports = router;