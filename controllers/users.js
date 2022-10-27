const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('reviews');
    if (users) {
        response.json(users);
    } else {
        response.status(404).end();
    }
});

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id);
    if (user) {
        response.json(user);
    } else {
        response.status(404).end();
    }
});

module.exports = usersRouter;
