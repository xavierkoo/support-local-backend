const mongoose = require('mongoose');
// plugin which adds pre-save validation for unique fields within a Mongoose schema.
const uniqueValidator = require('mongoose-unique-validator');

const merchantSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    imgUrl: {
        type: String,
        minlength: 3,
        required: true,
    },
    location: {
        type: String,
        minlength: 3,
        required: true,
    },
    phoneNo: {
        type: String,
        minlength: 8,
    },
    email: {
        type: String,
        minlength: 8,
        required: true,
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
});
merchantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Merchant', merchantSchema);
