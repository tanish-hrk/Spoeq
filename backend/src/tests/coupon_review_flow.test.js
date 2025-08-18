const request = require('supertest');

jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({ orders: { create: jest.fn(async ({ amount, currency, receipt }) => ({ id: 'order_RZP123', amount, currency, receipt, status: 'created' })) } }));
});

describe('Coupon and Review Flow', () => {
  let app;
  beforeAll(() => { process.env.NODE_ENV = 'test'; app = require('../../main'); });

  it('creates coupon and applies it in cart then creates order with discount', async () => {
    const email = 'user@test.com'; const password = 'Pass12345';
    await request(app).post('/auth/register').send({ email, password, name: 'User' });
    const User = require('../modules/auth/auth.model');
    await User.updateOne({ email }, { roles: ['admin'] });
    const loginRes = await request(app).post('/auth/login').send({ email, password });
    const token = loginRes.body.tokens.access;
    const productRes = await request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Coupon Test Product', slug: 'coupon-test-prod', price: { mrp: 200, sale: 150 }, stock: 5 });
    const productId = productRes.body._id;
    const couponRes = await request(app).post('/coupons').set('Authorization','Bearer '+token).send({ code: 'SAVE10', discountType: 'percent', value: 10 });
    expect(couponRes.status).toBe(201);
    await request(app).post('/cart').set('Authorization','Bearer '+token).send({ productId, qty: 2 });
    const applyRes = await request(app).post('/cart/apply-coupon').set('Authorization','Bearer '+token).send({ code: 'SAVE10' });
    expect(applyRes.status).toBe(200);
    expect(applyRes.body.discount).toBeGreaterThan(0);
    const orderRes = await request(app).post('/orders').set('Authorization','Bearer '+token).send();
    expect(orderRes.status).toBe(201);
    expect(orderRes.body.pricing.discountTotal).toBeGreaterThan(0);
  });

  it('rejects invalid coupon application', async () => {
    const email = 'user2@test.com'; const password = 'Pass12345';
    await request(app).post('/auth/register').send({ email, password, name: 'User2' });
    const loginRes = await request(app).post('/auth/login').send({ email, password });
    const token = loginRes.body.tokens.access;
    const res = await request(app).post('/cart/apply-coupon').set('Authorization','Bearer '+token).send({ code: 'BOGUS' });
    expect(res.status).toBe(404);
  });

  it('allows review after order paid and updates rating', async () => {
    const email = 'user3@test.com'; const password = 'Pass12345';
    await request(app).post('/auth/register').send({ email, password, name: 'User3' });
    const User = require('../modules/auth/auth.model');
    await User.updateOne({ email }, { roles: ['admin','customer'] });
    const loginRes = await request(app).post('/auth/login').send({ email, password });
    const token = loginRes.body.tokens.access;
    const productRes = await request(app)
      .post('/products')
      .set('Authorization','Bearer '+token)
      .send({ name: 'Review Prod', slug: 'review-prod', price: { mrp: 100, sale: 80 }, stock: 3 });
    const productId = productRes.body._id;
    await request(app).post('/cart').set('Authorization','Bearer '+token).send({ productId, qty: 1 });
    const orderRes = await request(app).post('/orders').set('Authorization','Bearer '+token).send();
    const orderId = orderRes.body._id;
    const Order = require('../modules/order/order.model');
    await Order.updateOne({ _id: orderId }, { status: 'paid' });
    const reviewCreate = await request(app).post('/reviews').set('Authorization','Bearer '+token).send({ productId, rating: 5 });
    expect(reviewCreate.status).toBe(201);
    const createdId = reviewCreate.body._id;
    const approve = await request(app).patch(`/reviews/${createdId}/status`).set('Authorization','Bearer '+token).send({ status: 'approved' });
    expect(approve.status).toBe(200);
    const prod = await request(app).get('/products/'+productId);
    expect(prod.body.ratingAvg).toBeGreaterThan(0);
  });
});
