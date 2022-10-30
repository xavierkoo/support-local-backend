const mongoose = require('mongoose');
// plugin which adds pre-save validation for unique fields within a Mongoose schema.
const uniqueValidator = require('mongoose-unique-validator');

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    products: [
        {
            productId: Number,
            quantity: Number,
            name: String,
            price: Number,
        },
    ],
});

cartSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHsh;
    },
});

cartSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Cart', cartSchema);
