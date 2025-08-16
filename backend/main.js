require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Routers
const productRouter = require('./src/api/product');
const authRouter = require('./src/modules/auth/auth.routes');
const catalogRouter = require('./src/modules/catalog/catalog.routes');
const { errorHandler } = require('./src/middleware/error');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Mongo
async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName: uri.split('/').pop() });
  logger.info('MongoDB connected');
}
connectDb().catch(err => {
  logger.error('Mongo connect error', err);
  process.exit(1);
});

// Security / perf middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', time: Date.now() }));

// Legacy mock route (will deprecate)
app.use('/fetchproduct', productRouter);

// Domain routes
app.use('/auth', authRouter);
app.use('/products', catalogRouter);

// Error handling
// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use(errorHandler);

// Static (production build)
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  logger.info(`API listening on http://localhost:${PORT}`);
});
