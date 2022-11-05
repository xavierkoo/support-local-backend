/* This is the user schema. It is defining the user model. */
const mongoose = require('mongoose');
// plugin which adds pre-save validation for unique fields within a Mongoose schema.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        minlength: 8,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
    },
    profImageUrl: {
        type: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    orderDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
