const Review = require('../models/review');

const initialReviews = [
    {
        id: '635ac30d9ae68ed65931b7a6',
        user: '635abc7fb01737e727fb4b36',
        product: '635abd38b01737e727fb4b38',
        orderDetails: 'Very good will buy again in the future',
    },

    {
        id: '623bc10d92ae67ed65931b7a6',
        user: '635abc7fb01737e727fb4b36',
        product: '615abd28b01437a727fb4b38',
        orderDetails: 'Not too bad good might or might not buy again in the future',
    },
];

const reviewsInDb = async () => {
    const reviews = await Review.find({});
    return reviews.map((review) => review.toJSON());
};

module.exports = {
    initialReviews, reviewsInDb,
};
