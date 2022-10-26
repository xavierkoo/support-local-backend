const mongoose = require('mongoose');
// plugin which adds pre-save validation for unique fields within a Mongoose schema.
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    productId: {
        type: Number,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    specialPrice: {
        type: Number,
    },
    category: {
        type: 'String',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    imgUrl: {
        type: String,
        minlength: 3,
        required: true,
    },
    numberSold: {
        type: Number,
        required: true,
    },
    productDesc: {
        type: String,
        required: true,
    },
    productSpec: {
        type: Array,
        required: true,
    },
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
    },
});

productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', productSchema);
