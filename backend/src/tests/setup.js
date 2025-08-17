const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
let mongo;

beforeAll(async () => {
	mongo = await MongoMemoryServer.create();
	process.env.MONGO_URI = mongo.getUri();
	process.env.JWT_ACCESS_SECRET = 'test_access';
	process.env.JWT_REFRESH_SECRET = 'test_refresh';
	process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
	process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret';
});

afterAll(async () => {
	if (mongoose.connection.readyState === 1) await mongoose.connection.close();
	if (mongo) await mongo.stop();
});

afterEach(async () => {
	const { collections } = mongoose.connection;
	for (const key of Object.keys(collections)) {
		await collections[key].deleteMany({});
	}
});
