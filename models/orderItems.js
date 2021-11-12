const mongoose = require('mongoose');
const Product = require('./product');

const orderItemSchema = mongoose.Schema({
    // product: Product,
    quantity: Number
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);