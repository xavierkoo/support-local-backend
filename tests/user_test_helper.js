const User = require('../models/user');

const initialUsers = [
    {
        id: '635ac046b01737e727fb4b42',
        email: 'rayjeff@gmail.com',
        password: '6fwefw27fb4b38',
        profImageUrl: 'assets/img/placeholders/dp1.jpeg',
        reviews: [],
        orderDetails: [],
    },

    {
        id: '6366b3bea4f920b75c825f36',
        email: 'jeff@gmail.com',
        password: 'wdgfw3138',
        profImageUrl: 'assets/img/placeholders/dp2.jpeg',
        reviews: [],
        orderDetails: [],
    },
];

const usersInDb = async () => {
    const users = await User.find({});
    return users.map((user) => user.toJSON());
};

module.exports = {
    initialUsers, usersInDb,
};
