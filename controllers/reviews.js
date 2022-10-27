const reviewsRouter = require('express').Router();
const Review = require('../models/review');
const logger = require('../utils/logger');

reviewsRouter.get('/', async (request, response) => {
    const reviews = await Review
        .find({}).populate('user').populate('product');
    if (reviews) {
        response.json(reviews);
    } else {
        response.status(404).end();
    }
});

reviewsRouter.get('/:id', async (request, response) => {
    const review = await Review.findById(request.params.id);
    if (review) {
        response.json(review);
    } else {
        response.status(404).end();
    }
});

module.exports = reviewsRouter;
