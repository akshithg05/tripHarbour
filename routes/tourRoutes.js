const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
//const reviewController = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

// Nested route implementation for reviews without mergeParams
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter);

// Creating a router for top 5 cheapest tours and passing a middleware (alaisTopCheapest) to
// manipulate the incoming request body
router
  .route('/top-5-cheapest')
  .get(tourController.alaisTopCheapest, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getTourPlan,
  );

// This is for giving a list of tours which start from a given center within a given radius
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// can also be done as /tours-within?distance=150&latlng=40,-45&unit=km

// Find the distances of all tours from a given point
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
// router.param('id', tourController.checkID);
router
  .route('/')
  .get(tourController.getAllTours)
  // passing a middleware to execute before the post function
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// When we have only one export we can use module.exports
module.exports = router;
