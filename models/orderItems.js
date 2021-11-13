const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
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