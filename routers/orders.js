const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderItem } = require("../models/orderItems");

// Get all orders with user info
router.get(`/`, async (req, res) => {
  // grabs user name from order and sorts from new to old
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

// Get one order
router.get(`/:id`, async (req, res) => {
  // populates product of order and showing category
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

// Gets total orders
router.get(`/get/sales`, async (req, res) => {
  const orderCount = await Order.countDocuments();
  // If theres no products
  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
});

// post order route
router.post(`/`, async (req, res) => {
  // Promise.all combines promises being sent back because of async func
  // Maps over and returns Array of IDs to pass into Order
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  // Unpacks promise being sent from orderItemIds
  const orderItemsIdsResolved = await orderItemsIds;

    // Calculate Total Price of order
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        // Maps over resolved Item IDs and grabs price
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        // Multiplies Product price by quanity
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))
    // Adds all the individual product prices to one
    const totalPrice = totalPrices.reduce((a,b) => a + b, 0);
    console.log(totalPrices)

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
    totalPrice: totalPrice,
    user: req.body.user,
  });
  // Save to DB
  order = await order.save();

  if (!order) return res.status(400).send("The Order could not be made");
  // Send to frontend
  res.send(order);
});

// Update Order Status
router.put('/:id', async (req, res) => {
    const orderStatus = await Order.findByIdAndUpdate(
        // grabs id from url
        req.params.id,
        // pass in values to update
        {
            status: req.body.status
        },
        // Sends back updated data instead of old data to console
        { new: true }
    )

     // if theres no category
     if (!orderStatus)
     return res.status(404).send('Order status was not updated');
 
     // send to frontend
     res.send(orderStatus);
})

// Delete Order along with the products in the order
router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'Order Destroyed!'})
        } else {
            return res.status(404).json({success: false , message: "Order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;
