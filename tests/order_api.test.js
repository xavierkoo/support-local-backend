const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./order_test_helper');
const app = require('../app');

const api = supertest(app);

const Order = require('../models/order');

beforeEach(async () => {
    await Order.deleteMany({});

    const orderObjects = helper.initialOrders
        .map((order) => new Order(order));

    const promiseArray = orderObjects.map((order) => order.save());

    await Promise.all(promiseArray);
});

describe('initial orders in database', () => {
    test('orders are returned as json', async () => {
        await api
            .get('/api/orders')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);

    test('all orders are returned', async () => {
        const response = await api
            .get('/api/orders');

        expect(response.body).toHaveLength(helper.initialOrders.length);
    });

    test('a specific user is within the returned orders', async () => {
        const response = await api
            .get('/api/orders');

        const users = response.body.map((u) => u.user);
        expect(users).toContain(
            '6366b3bea4f920b75c825f36',
        );
    });

    test('a specific order can be viewed', async () => {
        const ordersAtStart = await helper.ordersInDb();

        const orderToView = ordersAtStart[0];

        const resultOrder = await api
            .get(`/api/orders/${orderToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedOrderToView = JSON.parse(JSON.stringify(orderToView));

        expect(resultOrder.body).toEqual(processedOrderToView);
    });

    test('unique identifier by default is _id', async () => {
        const ordersAtStart = await helper.ordersInDb();
        expect(ordersAtStart[0].id).toBeDefined();
    });
});

describe('adding a order', () => {
    test('a valid order can be added', async () => {
        const newOrder = {
            _id: '636b44c3ff853a9953a43b77',
            user: '6367e51281f099ed5e63a970',
            orderDate: '29/11/2002',
            orderStatus: 'Item Received!',
            deliveryDate: '11/12/2022',
            products: [],
        };

        await api
            .post('/api/orders')
            .send(newOrder)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const ordersAtEnd = await helper.ordersInDb();
        expect(ordersAtEnd).toHaveLength(helper.initialOrders.length + 1);

        const users = ordersAtEnd.map((u) => u.user);
        expect(users).toContain(
            '6367e51281f099ed5e63a970',
        );
    });

    test('order without content is not added', async () => {
        const newOrder = {
            orderDate: '29/11/2002',
            orderStatus: 'Item Received!',
        };

        await api
            .post('/api/orders')
            .send(newOrder)
            .expect(400);

        const ordersAtEnd = await helper.ordersInDb();

        expect(ordersAtEnd).toHaveLength(helper.initialOrders.length);
    });
});

describe('updating an order', () => {
    test('updating order status', async () => {
        const ordersAtStart = await helper.ordersInDb();
        const orderToUpdate = ordersAtStart[ordersAtStart.length - 1];
        const updatedOrder = {
            products: [],
        };
        await api
            .patch(`/api/order/${orderToUpdate.id}`)
            .send(updatedOrder)
            .expect(204);

        const ordersAtEnd = await helper.ordersInDb();
        const anOrderAtEnd = ordersAtEnd.find((b) => b.id === orderToUpdate.id);
        expect(anOrderAtEnd.products).toHaveSize(0);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
