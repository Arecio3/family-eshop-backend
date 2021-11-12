const mongoose = require('mongoose');
const OrderItem = require('./orderItems');
const User = require('./user');

const orderSchema = mongoose.Schema({
    orderItems: OrderItem,
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: String,
    city: String,
    zip: String,
    country: String,
    phone: String,
    totalPrice: Number,
    user: User,
    dateOrdered: Date
})
exports.Order = mongoose.model('Order', orderSchema);