const mongoose = require('mongoose');
const Product = require('./product');

const orderItemSchema = mongoose.Schema({
    // product: Product,
    quantity: Number
})

// Virtuals to change _id to id
orderItemSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
// To be able to send values from front to back 
orderItemSchema.set('toJSON' , {
    virtuals: true,
});

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
exports.orderItemSchema = orderItemSchema;