const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./merchant_test_helper');
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

describe('adding a merchant', () => {
    test('a valid merchant can be added', async () => {
        const newMerchant = {
            _id: '5a422aa71b54a676234d17f8',
            name: 'Bread Shop',
            aboutUs: 'Bread Shop is the industry-leading Bread',
            imgUrl: 'assets/img/merchants/bread.avif',
            location: 'WCEGA TOWER 21 Bukit Batok Crescent #22-76/77 S658065',
            coord: '1.3373358061749812, 103.75979398873014',
            phoneNo: '62664475',
            email: 'contactus@bread.sg',
            lastOnline: 3,
            products: [],
        };

        await api
            .post('/api/merchants')
            .send(newMerchant)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const merchantsAtEnd = await helper.merchantsInDb();
        expect(merchantsAtEnd).toHaveLength(helper.initialMerchants.length + 1);

        const names = merchantsAtEnd.map((n) => n.name);
        expect(names).toContain(
            'Bread Shop',
        );
    });

    test('merchant without content is not added', async () => {
        const newMerchant = {
            coord: '1.3373358061749812, 103.75979398873014',
            phoneNo: '62664475',
        };

        await api
            .post('/api/merchants')
            .send(newMerchant)
            .expect(400);

        const merchantsAtEnd = await helper.merchantsInDb();

        expect(merchantsAtEnd).toHaveLength(helper.initialMerchants.length);
    });

     test('like property missing, default to 0', async () => {
        const newBlog = {
          title: 'Boxing for Dummies',
          author: 'Bober Dylan',
          url: 'www.boberdyl.com',
        }
    
        await api
          .post('/api/blogs')
          .send(newBlog)
          .set(headers)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        const addedBlog = await blogsAtEnd.find((blog) => blog.title === newBlog.title)
        expect(addedBlog.likes).toBe(0)
      })
    }) 

    describe('updating a merchant product', () => {
      test('updating merchant product', async () => {
          const merchantsAtStart = await helper.merchantsInDb();
          const merchantToUpdate = merchantsAtStart[merchantsAtStart.length - 1];
          const updatedMerchant = {
              products: [],
          };
          await api
              .patch(`/api/merchant/${merchantToUpdate.id}`)
              .send(updatedMerchant)
              .expect(204);
  
          const merchantsAtEnd = await helper.merchantsInDb();
          const aMerchantAtEnd = merchantsAtEnd.find((b) => b.id === merchantToUpdate.id);
          expect(aMerchantAtEnd.products).toHaveSize(0);
      });
  });
  
  describe('deleting a blog', () => {
    beforeEach(async () => {
      const newUser = {
        username: 'root',
        name: 'root',
        password: 'password',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
  
      const result = await api
        .post('/api/login')
        .send(newUser)
  
      headers = {
        Authorization: `bearer ${result.body.token}`,
      }
  
      const newBlog = {
        title: 'The best blog ever',
        author: 'Me',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set(headers)
        .expect(201)
    })
  
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set(headers)
        .expect(204)
  
      const blogsAtEnd = await helper.blogsInDb()
  
      expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1,
      )
  
      const titles = blogsAtEnd.map((r) => r.title)
  
      expect(titles).not.toContain(blogToDelete.title)
    })
  })

afterAll(() => {
    mongoose.connection.close();
});
