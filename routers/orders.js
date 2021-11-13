const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { OrderItem } = require('../models/orderItems');

// Get all orders
router.get(`/`, async (req, res) => {
    const orderList = await Order.find();

    if (!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

// post order route
router.post(`/`, async (req, res) => {
    // Promise.all combines promises being sent back because of async func
    // Maps over and returns Array of IDs to pass into Order
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id
    }))
    // Unpacks promise being sent from orderItemIds
    const orderItemsIdsResolved = await orderItemsIds;

    // console.log(orderItemsIdsResolved);

    // Creating new order with request from body of DOM
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })
    // Save to DB
    order = await order.save()

    if (!order)
    return res.status(400).send('The Order could not be made')
    // Send to frontend
    res.send(order);
})

module.exports = router;