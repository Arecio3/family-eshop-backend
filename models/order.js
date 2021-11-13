const mongoose = require('mongoose');
const OrderItems = require('./orderItems');
const User = require('./user');

const orderSchema = mongoose.Schema({
    // orderItems: OrderItems,
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
    // user: User,
    dateOrdered: Date
})

// Virtuals to change _id to id
orderSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
// To be able to send values from front to back 
orderSchema.set('toJSON' , {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);
exports.orderSchema = orderSchema;