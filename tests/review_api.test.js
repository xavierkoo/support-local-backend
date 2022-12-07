const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./review_test_helper');
const app = require('../app');

const api = supertest(app);

const Review = require('../models/review');

beforeEach(async () => {
    await Review.deleteMany({});

    const reviewObjects = helper.initialReviews
        .map((review) => new Review(review));

    const promiseArray = reviewObjects.map((review) => review.save());

    await Promise.all(promiseArray);
});

describe('initial reviews in database', () => {
    test('reviews are returned as json', async () => {
        await api
            .get('/api/reviews')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);

    test('all reviews are returned', async () => {
        const response = await api
            .get('/api/reviews');

        expect(response.body).toHaveLength(helper.initialReviews.length);
    });

    test('a specific review is within the returned reviews', async () => {
        const response = await api
            .get('/api/reviews');

        const reviews = response.body.map((r) => r.id);
        expect(reviews).toContain(
            '635ac30d9ae68ed65931b7a6',
        );
    });

    test('a specific review can be viewed', async () => {
        const reviewsAtStart = await helper.reviewsInDb();

        const reviewToView = reviewsAtStart[0];

        const resultReview = await api
            .get(`/api/reviews/${reviewToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedReviewToView = JSON.parse(JSON.stringify(reviewToView));

        expect(resultReview.body).toEqual(processedReviewToView);
    });

    test('unique identifier by default is _id', async () => {
        const reviewsAtStart = await helper.reviewsInDb();
        expect(reviewsAtStart[0].id).toBeDefined();
    });
});

describe('adding a review', () => {
    test('a valid review can be added', async () => {
        const newReview = {
            _id: '635ac30d9ae68ed65931b7a6',
            user: '635ac046b01737e727fb4b42',
            product: '635ac046b01737e727fb4b42',
            rating: 3,
            orderDetails: 'Fast Delivery, good quality product, will buy again!',
        };

        await api
            .post('/api/reviews')
            .send(newReview)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const reviewsAtEnd = await helper.reviewsInDb();
        expect(reviewsAtEnd).toHaveLength(helper.initialReviews.length + 1);

        const ids = reviewsAtEnd.map((i) => i._id);
        expect(ids).toContain(
            '635ac30d9ae68ed65931b7a6',
        );
    });

    test('review without content is not added', async () => {
        const newReview = {
            rating: 3,
            orderDetails: 'Fast Delivery, good quality product, will buy again!',
        };

        await api
            .post('/api/reviews')
            .send(newReview)
            .expect(400);

        const reviewsAtEnd = await helper.reviewsInDb();

        expect(reviewsAtEnd).toHaveLength(helper.initialReviews.length);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
