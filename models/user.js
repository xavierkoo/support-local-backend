const mongoose = require('mongoose');
// plugin which adds pre-save validation for unique fields within a Mongoose schema.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        minlength: 8,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        unique: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    shoppingCart: {
        type: Array,
    },
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
