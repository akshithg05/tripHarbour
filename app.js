const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//Setting template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Middelware is a function which is used to modify the incoming request data

// Middleware for testing static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.mapbox.com',
          'https://js.stripe.com',
          'https://m.stripe.network',
          'https://*.cloudflare.com',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://m.stripe.network',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:', '*.openstreetmap.org'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://127.0.0.1:*',
          'ws://localhost:*',
        ],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

app.use(cors());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 requests from the same IP in 1 hour
  message: 'Too many requests from this IP, please try again in an hour!', // Error message
});

// Use limiter for all routes that start with /api
app.use('/api', limiter);

// Body parser, mximum body size
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection, checks request.params, body and other "$" signs
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent Parameter pollution
// Whitelist is array of properties where we allow duplicate
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'rating',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// We always use app.use() to use middleware, and pass a function inside it.
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next(); //When we create our own middleware, we will have access to the next() function, and we have to call it, otherwise the req, res cycle will never end, and we will be stuck.
});

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// 3) ROUTES
// Mounting the router

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);
// all() functions means for all http req types
// * is for all urls
// Since middlewares are executed in order, the below block of code
// should be in the end of our file.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server.`,
  // });
  // next();
  //-----------------------------------------
  // const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // // Whenever we pass anything inside next() func express assumes its an error
  // // This skips all other middlewares in the stack and goes to the error middleware
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE FUNCTION
// By specifying 4 args express knows its a error handling middleware
app.use(globalErrorHandler);

module.exports = app;
