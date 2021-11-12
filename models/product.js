const mongoose = require('mongoose');
const Category = require('./category');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: String,
    countInStock: {
        type: Number,
        required: true
    },
    images: Array,
    description: String,
    richDescription: String,
    brand: String,
    price: {
        type: Number,
        required: true
    },
    // category: {
    //     type: Category,
    //     required: true
    // },
    rating: Number,
    isFeatured: Boolean,
    condition: { 
        type: String,
        required: true
    },
    dateCreated: Date,
    brand: String
})

exports.Product = mongoose.model('Product', productSchema);