const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: String,
    icon:  String,
    image: String
})

// Virtuals to change _id to id
productSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
// To be able to send values from front to back 
productSchema.set('toJSON' , {
    virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);
exports.categorySchema = categorySchema;