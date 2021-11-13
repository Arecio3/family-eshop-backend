const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
    },
    images: [{
        type: String,
    }],
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    condition: { 
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    brand: {
        type: String,
        default: '',
    }
})

// Virtuals to change _id to id
productSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
// To be able to send values from front to back 
productSchema.set('toJSON' , {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);
exports.productSchema = productSchema;