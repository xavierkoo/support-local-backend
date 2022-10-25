// const bcrypt = require('bcrypt')
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('review');
    if (users) {
        response.json(users);
    } else {
        response.status(404).end();
    }
});

module.exports = usersRouter;
