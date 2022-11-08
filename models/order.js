/* This is the order model. It is used to create orders. */
const mongoose = require('mongoose');
// plugin which adds pre-save validation for unique fields within a Mongoose schema.
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = mongoose.Schema({
    user: {
        type: String,
    },
    orderDate: {
        type: String,
    },
    orderStatus: {
        type: String,
    },
    products: {
        type: Array,
    },
    deliveryDate: {
        type: String,
    },
});

orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);
