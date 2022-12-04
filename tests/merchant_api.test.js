const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Merchant = require('../models/merchant');

beforeEach(async () => {
    await Merchant.deleteMany({});

    const merchantObjects = helper.initialMerchants
        .map((merchant) => new Merchant(merchant));

    const promiseArray = merchantObjects.map((merchant) => merchant.save());

    await Promise.all(promiseArray);
});

describe('initial merchants in database', () => {
    test('merchants are returned as json', async () => {
        await api
            .get('/api/merchants')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);

    test('all merchants are returned', async () => {
        const response = await api
            .get('/api/merchants');

        expect(response.body).toHaveLength(helper.initialMerchants.length);
    });

    test('a specific merchant is within the returned merchants', async () => {
        const response = await api
            .get('/api/merchants');

        const names = response.body.map((n) => n.name);
        expect(names).toContain(
            'Smile Tutor',
        );
    });

    test('a specific merchant can be viewed', async () => {
        const merchantsAtStart = await helper.merchantsInDb();

        const merchantToView = merchantsAtStart[0];

        const resultMerchant = await api
            .get(`/api/merchants/${merchantToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedMerchantToView = JSON.parse(JSON.stringify(merchantToView));

        expect(resultMerchant.body).toEqual(processedMerchantToView);
    });

    test('unique identifier by default is _id', async () => {
        const merchantsAtStart = await helper.merchantsInDb();
        expect(merchantsAtStart[0].id).toBeDefined();
    });
});

afterAll(() => {
    mongoose.connection.close();
});
