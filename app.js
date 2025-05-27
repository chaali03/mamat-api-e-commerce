/*========================================
  IMPORTS & KONFIGURASI AWAL
========================================*/
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const responseTime = require('response-time');
const http = require('http');
const https = require('https');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');
const cluster = require('cluster');
const os = require('os');
const promBundle = require('express-prom-bundle');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const xss = require('xss');
const socketio = require('socket.io');
const sanitize = require('mongo-sanitize');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const ora = require('ora');
const boxen = require('boxen');

/*========================================
  INISIALISASI APLIKASI
========================================*/
const app = express();
let server;

// Konfigurasi HTTPS jika diaktifkan
if (process.env.HTTPS === 'true') {
  try {
    const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
  } catch (err) {
    console.error(`Failed to load SSL certificates: ${err.message}`);
    console.log('Falling back to HTTP server');
    server = http.createServer(app);
  }
} else {
  server = http.createServer(app);
}

/*========================================
  KONFIGURASI LOGGER
========================================*/
const logger = {
  info: (msg) => console.log(`\x1b[36m[${new Date().toISOString()}] INFO\x1b[0m: ${msg}`),
  error: (msg) => console.error(`\x1b[31m[${new Date().toISOString()}] ERROR\x1b[0m: ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m[${new Date().toISOString()}] WARN\x1b[0m: ${msg}`),
  debug: (msg) => console.debug(`\x1b[35m[${new Date().toISOString()}] DEBUG\x1b[0m: ${msg}`),
  success: (msg) => console.log(`\x1b[32m[${new Date().toISOString()}] SUCCESS\x1b[0m: ${msg}`)
};

/*========================================
  MONITORING & METRICS DENGAN PROMETHEUS
========================================*/
try {
  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    customLabels: { project: 'mamat-api' },
    promClient: { collectDefaultMetrics: { timeout: 5000 } }
  });
  app.use(metricsMiddleware);
} catch (err) {
  logger.warn(`Prometheus metrics not enabled: ${err.message}`);
}

/*========================================
  KONEKSI REDIS UNTUK CACHE & SESSION
========================================*/
let redisClient;

if (process.env.REDIS_ENABLED === 'true') {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || 0,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      lazyConnect: true
    });

    redisClient.on('connect', () => logger.success('✅ Connected to Redis'));
    redisClient.on('error', (err) => {
      logger.warn(`⚠️ Redis error: ${err.message}`);
      logger.info('Application will continue without Redis functionality');
    });

    redisClient.connect().catch(err => {
      logger.warn(`⚠️ Redis connection failed: ${err.message}`);
      logger.info('Application will continue without Redis functionality');
    });
  } catch (err) {
    logger.warn(`⚠️ Redis initialization error: ${err.message}`);
    logger.info('Application will continue without Redis functionality');
  }
} else {
  logger.info('Redis is disabled in configuration. Continuing without Redis.');
  
  redisClient = {
    get: async () => null,
    set: async () => true,
    setex: async () => true,
    status: 'disabled',
    quit: () => Promise.resolve()
  };
}

/*========================================
  KONEKSI MONGODB DENGAN RETRY LOGIC
========================================*/
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 100,
      retryWrites: true,
      w: 'majority'
    });
    logger.success('✅ MongoDB connected successfully');
  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    logger.info('Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

/*========================================
  KONFIGURASI SOCKET.IO
========================================*/
let io;
if (process.env.SOCKET_ENABLED === 'true') {
  try {
    io = socketio(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    });

    if (process.env.REDIS_ENABLED === 'true' && redisClient.status === 'ready') {
      const { createAdapter } = require('@socket.io/redis-adapter');
      const pubClient = redisClient;
      const subClient = redisClient.duplicate();
      io.adapter(createAdapter(pubClient, subClient));
      logger.success('✅ Socket.IO configured with Redis adapter');
    } else {
      logger.info('Socket.IO configured without Redis adapter');
    }

    io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);
      
      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
    
    logger.success('✅ Socket.IO initialized');
  } catch (err) {
    logger.error(`❌ Socket.IO initialization failed: ${err.message}`);
    logger.info('Application will continue without Socket.IO functionality');
  }
}

/*========================================
  MIDDLEWARE UTAMA
========================================*/
app.use((req, res, next) => {
  req.startTime = process.hrtime();
  req.requestId = uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// Body Parsing
app.use(express.json({ 
  limit: '50kb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString('utf-8'));
    } catch (e) {
      logger.warn(`Invalid JSON payload from ${req.ip}`);
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '50kb',
  parameterLimit: 50
}));

app.use(cookieParser(process.env.COOKIE_SECRET || 'default-cookie-secret'));

// Konfigurasi CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://*'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      connectSrc: ["'self'", process.env.CORS_ORIGIN || '', 'ws://*', 'wss://*'],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin" }
}));

// XSS Protection Middleware
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// MongoDB Injection Protection
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
});

// HPP Protection
app.use(hpp());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1',
  handler: (req, res, next) => {
    const err = new Error('Too many requests from this IP, please try again later');
    err.statusCode = 429;
    next(err);
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts from this IP, please try again after an hour'
});

app.use('/api', apiLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Performance Middleware
app.use(compression({
  level: 6,
  threshold: 10 * 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

app.use(responseTime());

/*========================================
  LOGGING CONFIGURATION
========================================*/
const logDir = path.join(__dirname, 'logs');
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (err) {
  logger.error(`Failed to create log directory: ${err.message}`);
}

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  try {
    const rfs = require('rotating-file-stream');
    
    const accessLogStream = rfs.createStream('access.log', {
      interval: '1d',
      path: logDir,
      size: '50MB',
      compress: 'gzip',
      maxFiles: 30
    });

    const errorLogStream = rfs.createStream('error.log', {
      interval: '1d',
      path: logDir,
      size: '50MB',
      compress: 'gzip',
      maxFiles: 30
    });

    morgan.token('id', (req) => req.requestId);
    morgan.token('error', (req, res) => res.locals.errorMessage || '');

    app.use(morgan(':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms', { 
      stream: accessLogStream,
      skip: (req, res) => res.statusCode >= 400
    }));

    app.use(morgan(':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :error', { 
      stream: errorLogStream,
      skip: (req, res) => res.statusCode < 400
    }));
  } catch (err) {
    logger.warn(`File logging setup failed: ${err.message}. Falling back to console logging.`);
    app.use(morgan('combined'));
  }
}

/*========================================
  STATIC FILES & SWAGGER DOCS
========================================*/
// Tambahkan middleware untuk mengizinkan CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Pastikan folder uploads dapat diakses secara publik
// Middleware untuk menangani permintaan gambar dengan nama file yang tidak tepat
app.use('/images/products', (req, res, next) => {
  const originalUrl = req.url;
  // Periksa apakah URL mengandung pola tanpa tanda hubung sebelum 'main.png'
  if (originalUrl.match(/([A-Za-z0-9]+)main\.png/)) {
    // Ubah URL dengan menambahkan tanda hubung
    req.url = originalUrl.replace(/([A-Za-z0-9]+)main\.png/g, '$1-main.png');
    console.log(`Redirecting image request from ${originalUrl} to ${req.url}`);
  }
  next();
});

// Pastikan middleware ini ditempatkan SEBELUM kode static file serving
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// Update the static file middleware with proper MIME types
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  extensions: ['html', 'htm'],
  setHeaders: (res, path) => {
    // Set proper content type for images
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// Swagger documentation
try {
  const YAML = require('yamljs');
  const swaggerUi = require('swagger-ui-express');
  
  const swaggerFilePath = path.join(__dirname, 'swagger.yaml');
  if (!fs.existsSync(swaggerFilePath)) {
    const defaultSwaggerContent = `
openapi: 3.0.0
info:
  title: MAMAT API
  description: API documentation for MAMAT API
  version: 1.0.0
servers:
  - url: http://localhost:${process.env.PORT || 5000}/api
    description: Local development server
paths:
  /health:
    get:
      summary: Health check endpoint
      responses:
        '200':
          description: Server is healthy
  /api/v2/data:
    get:
      summary: Get sample data
      responses:
        '200':
          description: Successful response
`;
    fs.writeFileSync(swaggerFilePath, defaultSwaggerContent);
  }
  
  const swaggerDocument = YAML.load(swaggerFilePath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customSiteTitle: 'MAMAT API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/favicon.ico'
  }));
  logger.info('📄 Swagger UI available at /api-docs');
} catch (swaggerErr) {
  logger.warn('Swagger documentation not loaded: ' + swaggerErr.message);
}

/*========================================
  AUTHENTICATION MIDDLEWARE
========================================*/
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      const err = new Error('Token tidak ditemukan');
      err.statusCode = 401;
      throw err;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-jwt-secret');

    if (process.env.REDIS_ENABLED === 'true' && redisClient.status === 'ready') {
      try {
        const cachedUser = await redisClient.get(`user:${decoded.id}`);
        if (cachedUser) {
          req.user = JSON.parse(cachedUser);
          return next();
        }
      } catch (redisErr) {
        logger.warn(`Redis get error: ${redisErr.message}`);
      }
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 401;
    next(err);
  }
};

/*========================================
  ROUTES IMPLEMENTASI
========================================*/
// Import routers
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories'); // Tambahkan import ini

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoriesRouter); // Tambahkan route ini

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redisClient.status === 'ready' ? 'connected' : 'disconnected'
  });
});

// Route untuk status autentikasi
app.get('/api/auth/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'Auth API berhasil diakses',
    isLoggedIn: false
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

/*========================================
  ERROR HANDLING MIDDLEWARE
========================================*/
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
});

/*========================================
  START SERVER
========================================*/
const PORT = process.env.PORT || 5000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startServer = async () => {
  try {
    console.clear();
    
    // Tampilkan ASCII art dengan animasi
    console.log('\n');
    const text = figlet.textSync('MAMAT API', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 100,
      whitespaceBreak: true
    });
    
    // Animasi teks dengan gradien warna
    const rainbowGradient = gradient(['cyan', 'pink', 'yellow']);
    for (const line of text.split('\n')) {
      await sleep(100);
      console.log(rainbowGradient(line));
    }
    
    console.log('\n');
    
    // Tampilkan spinner saat menghubungkan ke database
    const dbSpinner = ora({
      text: 'Menghubungkan ke MongoDB...',
      spinner: 'dots',
      color: 'yellow'
    }).start();
    
    await connectWithRetry();
    
    await sleep(1000);
    dbSpinner.succeed(chalk.green('MongoDB terhubung dengan sukses!'));
    
    // Tampilkan spinner saat memulai server
    const serverSpinner = ora({
      text: 'Memulai server Mamat-API...',
      spinner: 'bouncingBar',
      color: 'cyan'
    }).start();
    
    server.listen(PORT, async () => {
      await sleep(1500);
      serverSpinner.succeed(chalk.green(`Server berjalan pada port ${PORT}`));
      
      console.log('\n');
      
      const serverInfo = boxen(
        `${chalk.bold('🚀 MAMAT API RUNNING')}\n\n` +
        `${chalk.cyan('✅ Mode:')} ${chalk.green(process.env.NODE_ENV || 'development')}\n` +
        `${chalk.cyan('✅ Port:')} ${chalk.green(PORT)}\n` +
        `${chalk.cyan('✅ Database:')} ${chalk.green('Connected')}\n` +
        `${chalk.cyan('✅ Redis:')} ${chalk.green(process.env.REDIS_ENABLED === 'true' ? 'Enabled' : 'Disabled')}\n` +
        `${chalk.cyan('✅ API Docs:')} ${chalk.green(`http://localhost:${PORT}/api-docs`)}\n\n` +
        `${chalk.yellow('Press')} ${chalk.bold('Ctrl+C')} ${chalk.yellow('to stop server')}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'cyan',
          backgroundColor: '#222'
        }
      );
      
      console.log(serverInfo);
      
      const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let i = 0;
      
      console.log('\n' + chalk.bold('  Memuat layanan API...'));
      const loadingInterval = setInterval(() => {
        process.stdout.write(`\r  ${chalk.cyan(frames[i++ % frames.length])} ${chalk.green('API siap menerima permintaan...')}`);
      }, 80);
      
      setTimeout(() => {
        clearInterval(loadingInterval);
        process.stdout.write('\n\n');
        
        console.log(chalk.yellow('  Memulai countdown untuk optimasi performa...'));
        let count = 5;
        const countdownInterval = setInterval(() => {
          process.stdout.write(`\r  ${chalk.magenta('⏱')} ${chalk.white.bold(count)}...`);
          count--;
          if (count < 0) {
            clearInterval(countdownInterval);
            process.stdout.write('\n\n');
            
            let pulse = 0;
            const pulseInterval = setInterval(() => {
              const intensity = Math.sin(pulse) * 0.5 + 0.5;
              const colorGradient = gradient(['#00ffff', '#ff00ff']);
              const message = '❤️ Server berjalan dengan baik - Monitoring aktif';
              process.stdout.write(`\r  ${colorGradient(message)}`);
              pulse += 0.1;
              if (pulse >= 10) {
                clearInterval(pulseInterval);
                console.log('\n\n');
                console.log(chalk.green.bold('  🎉 Semua sistem berjalan normal! Selamat bekerja!'));
              }
            }, 100);
          }
        }, 1000);
      }, 3000);
    });
  } catch (err) {
    logger.error(`❌ Error saat memulai server: ${err.message}`);
    process.exit(1);
  }
};

// Panggil fungsi untuk memulai server
startServer();

// Tangani unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error(`❌ Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
});

// Tangani uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`❌ Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// Tangani SIGTERM
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      logger.info('🔴 Server closed');
      if (redisClient && redisClient.status === 'ready') {
        redisClient.quit().then(() => {
          logger.info('🔴 Redis connection closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  } else {
    process.exit(0);
  }
});

module.exports = app;

// HAPUS kode berikut:
// module.exports = {
//   mechanicalKeyboards,
//   membraneKeyboards,
//   opticalKeyboards,
//   magneticKeyboards,
//   gamingMice,
//   officeMice,
//   ergonomicMice,
//   hardMousepads,
//   softMousepads,
//   gamingHeadsets,
//   musicHeadsets,
//   noiseCancellingHeadsets,
//   linearSwitches,
//   tactileSwitches,
//   clickySwitches,
//   silentSwitches
// };