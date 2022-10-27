const mongoose = require('mongoose');
// plugin which adds pre-save validation for unique fields within a Mongoose schema.
const uniqueValidator = require('mongoose-unique-validator');

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    email: {
        type: String,
        minlength: 8,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    profImageUrl: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    orderDetails: {
        type: String,
        minlength: 20,
    },
});

reviewSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

reviewSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Review', reviewSchema);
