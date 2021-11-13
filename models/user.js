const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    street: {
        type: String,
        default: '',
    },
    apartment: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    zip: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    state: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
})

// Virtuals to change _id to id
userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
// To be able to send values from front to back 
userSchema.set('toJSON' , {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;