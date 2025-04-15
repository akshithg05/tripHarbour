const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must contain text'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// INDEXING
// We are doing this indexing here so that one user can have only 1 review for a particular tour
// now each combination of tour and user will be unique
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query middleware to populate review with user details and tour details
// reviewSchema.pre(/^find/, function (next) {
// this.populate({
//   path: 'tour',
//   select: '-guides name',
// }).populate({
//   path: 'user',
//   select: 'name photo',
// });

// Query middleware to populate review with only user data.
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // 'this' now points to the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, // Aggregate all reviews having the same tourID
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // Fetch tour and update details
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // 'this' points to current review
  // 'constructor' points to the model which created this doc
  this.constructor.calcAverageRatings(this.tour);
});

// We need to update ratingsAverage when review is deleted/ updated.
// We use query middleware for this
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Here this points to the current query

  // Fetch review from the current query and save it to the query in the 'rev' variable.
  this.rev = await this.findOne();
  // We cannot directly update the review here as we still have old (not updated data)
  // at this point, because ths is a 'pre' middleware
  next();
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  // await this.findOne() does not work here as query already executed.
  // Fetch model
  await this.model.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
