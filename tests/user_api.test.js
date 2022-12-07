const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./user_test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

beforeEach(async () => {
    await User.deleteMany({});

    const userObjects = helper.initialUsers
        .map((user) => new User(user));

    const promiseArray = userObjects.map((user) => user.save());

    await Promise.all(promiseArray);
});

describe('initial users in database', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);

    test('all users are returned', async () => {
        const response = await api
            .get('/api/users');

        expect(response.body).toHaveLength(helper.initialUsers.length);
    });

    test('a specific user is within the returned users', async () => {
        const response = await api
            .get('/api/users');

        const emails = response.body.map((e) => e.email);
        expect(emails).toContain(
            'rayjeff@gmail.com',
        );
    });

    test('a specific user can be viewed', async () => {
        const usersAtStart = await helper.usersInDb();

        const userToView = usersAtStart[0];

        const resultUser = await api
            .get(`/api/users/${userToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedUserToView = JSON.parse(JSON.stringify(userToView));

        expect(resultUser.body).toEqual(processedUserToView);
    });

    test('unique identifier by default is _id', async () => {
        const usersAtStart = await helper.usersInDb();
        expect(usersAtStart[0].id).toBeDefined();
    });
});

describe('adding a user', () => {
    test('a valid user can be added', async () => {
        const newUser = {
            id: '63672224263d6f060974c315',
            email: 'bananabobzf@gmail.com',
            password: 'r332r38',
            profImageUrl: 'assets/img/placeholders/dp3.jpeg',
            reviews: [],
            orderDetails: [],
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

        const emails = usersAtEnd.map((e) => e.email);
        expect(emails).toContain(
            'bananabobzf@gmail.com',
        );
    });

    test('user without content is not added', async () => {
        const newUser = {
            profImageUrl: 'assets/img/placeholders/dp3.jpeg',
            reviews: [],
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);

        const usersAtEnd = await helper.usersInDb();

        expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
    });
});

describe('updating a user', () => {
    test('updating user with new review', async () => {
        const usersAtStart = await helper.usersInDb();
        const userToUpdate = usersAtStart[usersAtStart.length - 1];
        const updatedUser = {
            reviews: ['636e5451de327c77ff2a79f5'],
        };
        await api
            .patch(`/api/user/${userToUpdate.id}`)
            .send(updatedUser)
            .expect(204);

        const usersAtEnd = await helper.usersInDb();
        const aUserAtEnd = usersAtEnd.find((b) => b.id === userToUpdate.id);
        expect(aUserAtEnd.reviews).toHaveSize(1);
    });

    test('updating user with new order', async () => {
        const usersAtStart = await helper.usersInDb();
        const userToUpdate = usersAtStart[usersAtStart.length - 1];
        const updatedUser = {
            orders: ['636e53fede327c77ff2a79e9'],
        };
        await api
            .patch(`/api/user/${userToUpdate.id}`)
            .send(updatedUser)
            .expect(204);

        const usersAtEnd = await helper.usersInDb();
        const aUserAtEnd = usersAtEnd.find((b) => b.id === userToUpdate.id);
        expect(aUserAtEnd.orders).toHaveSize(1);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
