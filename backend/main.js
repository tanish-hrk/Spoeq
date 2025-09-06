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
const { initCache } = require('./src/utils/cache');
const fs = require('fs');

// Metrics (basic counters)
let metrics = { requests: 0, started: Date.now(), ready: false, totalLatencyMs: 0 };
const prom = { counters: { http_requests_total: 0 }, byStatus: {}, hist: [] };

// Routers
const productRouter = require('./src/api/product');
const authRouter = require('./src/modules/auth/auth.routes');
const catalogRouter = require('./src/modules/catalog/catalog.routes');
const cartRouter = require('./src/modules/cart/cart.routes');
const orderRouter = require('./src/modules/order/order.routes');
const reviewRouter = require('./src/modules/review/review.routes');
const couponRouter = require('./src/modules/coupon/coupon.routes');
const { errorHandler } = require('./src/middleware/error');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Mongo
async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName: uri.split('/').pop() });
  logger.info('MongoDB connected');
  metrics.ready = true;
}
connectDb().catch(err => {
  logger.error('Mongo connect error', err);
  process.exit(1);
});
initCache();

// Security / perf middleware with CSP allowing Razorpay
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'","'unsafe-inline'","https://checkout.razorpay.com"],
      connectSrc: ["'self'", ...(process.env.CORS_ORIGIN? process.env.CORS_ORIGIN.split(','): ['*'])],
      imgSrc: ["'self'","data:","blob:"],
      styleSrc: ["'self'","'unsafe-inline'"],
      frameSrc: ["'self'","https://api.razorpay.com","https://checkout.razorpay.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(morgan('dev'));
app.use((req,res,next)=> {
  metrics.requests++;
  prom.counters.http_requests_total++;
  const startHr = process.hrtime.bigint();
  res.on('finish', ()=> {
    const durMs = Number((process.hrtime.bigint() - startHr)/1000000n);
    metrics.totalLatencyMs += durMs;
    const status = res.statusCode;
    prom.byStatus[status] = (prom.byStatus[status]||0)+1;
    if(prom.hist.length < 5000) prom.hist.push(Math.min(durMs,60000));
  });
  next();
});
app.use(cors({ 
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'https://spoeq.vercel.app',
      'https://adminspoeq.vercel.app',
      'http://localhost:3000',
      'http://localhost:5175'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Explicit OPTIONS handler for preflight requests
app.options('*', cors());

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use(globalLimiter);

// Health
app.get('/health', (req, res) => {
  const cacheMode = process.env.REDIS_URL ? 'redis' : 'memory';
  res.json({ status: 'ok', time: Date.now(), cache: cacheMode });
});

// Readiness (returns 503 until DB ready)
app.get('/ready', (req,res)=> {
  if(!metrics.ready) return res.status(503).json({ status:'starting' });
  res.json({ status:'ready' });
});

// Metrics endpoint (no auth for now; consider securing)
app.get('/metrics', (req,res)=> {
  res.json({ ...metrics, uptimeMs: Date.now()-metrics.started, memory: process.memoryUsage() });
});

// Prometheus metrics (text)
app.get('/metrics/prom', (req,res)=> {
  const lines = [];
  lines.push('# HELP http_requests_total Total HTTP requests');
  lines.push('# TYPE http_requests_total counter');
  lines.push(`http_requests_total ${prom.counters.http_requests_total}`);
  lines.push('# HELP http_requests_status_total HTTP requests by status code');
  lines.push('# TYPE http_requests_status_total counter');
  Object.entries(prom.byStatus).forEach(([code,count])=> lines.push(`http_requests_status_total{status="${code}"} ${count}`));
  const buckets = [50,100,200,300,500,1000,2000,5000,10000,30000,60000];
  const counts = new Array(buckets.length).fill(0);
  for(const v of prom.hist){ for(let i=0;i<buckets.length;i++){ if(v <= buckets[i]) { counts[i]++; break; } } }
  let cumulative = 0;
  lines.push('# HELP http_request_duration_ms Request duration histogram (ms)');
  lines.push('# TYPE http_request_duration_ms histogram');
  buckets.forEach((b,i)=> { cumulative += counts[i]; lines.push(`http_request_duration_ms_bucket{le="${b}"} ${cumulative}`); });
  lines.push(`http_request_duration_ms_bucket{le="+Inf"} ${prom.hist.length}`);
  const sum = prom.hist.reduce((a,b)=> a+b,0);
  lines.push(`http_request_duration_ms_sum ${sum}`);
  lines.push(`http_request_duration_ms_count ${prom.hist.length}`);
  res.set('Content-Type','text/plain; version=0.0.4');
  res.send(lines.join('\n'));
});

// Basic audit log model + middleware (attach after json parsing)
const mongooseAudit = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  ip: String,
  userId: String,
  method: String,
  path: String,
  status: Number,
  ua: String
});
let Audit;
try { Audit = mongoose.model('Audit'); } catch(_) { Audit = mongoose.model('Audit', mongooseAudit); }
app.use(async (req,res,next)=>{
  const start = Date.now();
  res.on('finish', ()=> {
    // sample only subset to reduce load
    if(Math.random() < 0.2){
      const doc = new Audit({ ip: req.ip, userId: req.user?.id, method: req.method, path: req.path, status: res.statusCode, ua: req.headers['user-agent'] });
      doc.save().catch(()=>{});
    }
  });
  next();
});

// Legacy mock route (will deprecate)
app.use('/fetchproduct', productRouter);

// Domain routes
app.use('/auth', authLimiter, authRouter);
app.use('/products', catalogRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/reviews', reviewRouter);
app.use('/coupons', couponRouter);

// Error handling
// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use(errorHandler);

// Static (production build)
app.use(express.static(path.join(__dirname, '../dist')));
// Uploads directory exposure
const uploadDir = path.join(__dirname, 'uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => { logger.info(`API listening on http://localhost:${PORT}`); });
}

function shutdown(signal){
  return () => {
    logger.info(`${signal} received: closing server`);
    if(server){
      server.close(()=> {
        logger.info('HTTP server closed');
        mongoose.connection.close(false).then(()=> {
          logger.info('Mongo connection closed');
          process.exit(0);
        });
      });
      setTimeout(()=> { logger.warn('Force exit'); process.exit(1); }, 10000).unref();
    }
  };
}
['SIGINT','SIGTERM'].forEach(sig=> process.on(sig, shutdown(sig)));

module.exports = app;
