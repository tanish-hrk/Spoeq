const request = require('supertest');
jest.mock('razorpay', () => {
	return jest.fn().mockImplementation(() => ({
		orders: { create: jest.fn(async ({ amount, currency, receipt }) => ({ id: 'order_RZP123', amount, currency, receipt, status: 'created' })) }
	}));
});

describe('Auth -> Product -> Cart -> Order -> Payment flow', () => {
	let app;
	beforeAll(() => { process.env.NODE_ENV = 'test'; app = require('../../main'); });

	it('should register, login, create product (admin), add to cart, create order, create payment intent, verify payment', async () => {
		// Register admin user by seeding role manually after creation (simpler than separate endpoint)
		const email = 'admin@test.com';
		const password = 'Pass12345';
		await request(app).post('/auth/register').send({ email, password, name: 'Admin User' });
		const User = require('../modules/auth/auth.model');
		await User.updateOne({ email }, { roles: ['admin'] });
		const loginRes = await request(app).post('/auth/login').send({ email, password });
		expect(loginRes.status).toBe(200);
		const token = loginRes.body.tokens.access;

		// Create product
		const productRes = await request(app)
			.post('/products')
			.set('Authorization', 'Bearer ' + token)
			.send({ name: 'Test Product', slug: 'test-product', price: { mrp: 100, sale: 80 }, stock: 10 });
		expect(productRes.status).toBe(201);
		const productId = productRes.body._id;

		// Add to cart
		const addCart = await request(app)
			.post('/cart')
			.set('Authorization', 'Bearer ' + token)
			.send({ productId, qty: 2 });
		expect(addCart.status).toBe(201);

		// Create order
		const orderDraft = await request(app)
			.post('/orders')
			.set('Authorization', 'Bearer ' + token)
			.send();
		expect(orderDraft.status).toBe(201);
		const orderId = orderDraft.body._id;

		// Create payment intent (Razorpay order)
		const intentRes = await request(app)
			.post(`/orders/${orderId}/create-payment-intent`)
			.set('Authorization', 'Bearer ' + token)
			.send();
		expect(intentRes.status).toBe(200);
		expect(intentRes.body.razorpayOrderId).toBeDefined();

		// Simulate successful payment verification signature
		const crypto = require('crypto');
		const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
			.update(intentRes.body.razorpayOrderId + '|pay_123')
			.digest('hex');
			const verifyRes = await request(app)
			.post('/orders/verify')
			.set('Authorization', 'Bearer ' + token)
			.send({ orderId, razorpay_order_id: intentRes.body.razorpayOrderId, razorpay_payment_id: 'pay_123', razorpay_signature: generatedSignature });
			if(verifyRes.status !== 200) {
				 
				console.log('Verify failure body:', verifyRes.body);
			}
			expect(verifyRes.status).toBe(200);
			expect(verifyRes.body.success).toBe(true);
	});
});
