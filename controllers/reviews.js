const reviewsRouter = require('express').Router();
const Review = require('../models/review');
const logger = require('../utils/logger');

// get all reviews
reviewsRouter.get('/', async (request, response) => {
    const reviews = await Review
        .find({}).populate('user').populate('product');
    if (reviews) {
        response.json(reviews);
    } else {
        response.status(404).end();
    }
});

// get specific review
reviewsRouter.get('/:id', async (request, response) => {
    const review = await Review.findById(request.params.id);
    if (review) {
        response.json(review);
    } else {
        response.status(404).end();
    }
});

// add new review
reviewsRouter.post('/', async (request, response, next) => {
    const { body } = request;

    const review = new Review({
        user: body.user,
        product: body.product,
        rating: body.rating,
        orderDetails: body.orderDetails,
    });
    try {
        const savedReview = await review.save();
        logger.info(`added review ${review.id} to reviews`);
        response.status(201).json(savedReview);
    } catch (exception) {
        next(exception);
    }
});

module.exports = reviewsRouter;
