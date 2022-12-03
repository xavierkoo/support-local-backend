const mongoose = require('mongoose');
const supertest = require('supertest');
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
    test('merchant are returned as json', async () => {
        await api
            .get('/api/merchants')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);
});
