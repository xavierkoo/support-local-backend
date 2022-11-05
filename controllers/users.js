const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');

// get all users
usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('reviews');
    if (users) {
        response.json(users);
    } else {
        response.status(404).end();
    }
});

// get specific user
usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id);
    if (user) {
        response.json(user);
    } else {
        response.status(404).end();
    }
});

// add new user to database
usersRouter.post('/', async (request, response, next) => {
    const { body } = request;

    const user = new User({
        email: body.email,
        password: body.password,
        profImageUrl: body.profImageUrl,
        reviews: body.reviews,
        orderDetails: body.orderDetails,
    });
    try {
        const savedUser = await user.save();
        logger.info(`added ${user.username} to products`);
        response.status(201).json(savedUser);
    } catch (exception) {
        next(exception);
    }
});

// update user with new review
usersRouter.patch('/:id', async (request, response, next) => {
    const review = request.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, review, { new: true });
        response.status(204).json(updatedUser);
    } catch (exception) {
        next(exception);
    }
});

module.exports = usersRouter;
