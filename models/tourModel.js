const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('../models/userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters',
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        // This kind of validator is only for strings
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // round rounds off to integers.
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // This function wont work for update , only for create
          return val < this.price; // price disc. should be lesser than price
        }, // because of 'this' variable which points to current document
        message:
          'Discounted price ({VALUE}) should be lesser than actual price',
      },
    },
    summary: {
      type: String,
      trim: true, // only for string, remove white space before and after string
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date, // built in JS datatype
      default: Date.now(),
      select: false, // Dont show it in the response
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      deafult: false,
    },
    startLocation: {
      // GeoJSON data - type and coordinates are mandatory fields for GeoJSON data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'], // it can take only point as type
      },
      coordinates: [Number], // Here we expect an array of numbers
      address: String,
      description: String,
    },
    //Embedded data of locations inside tours
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      // Child referencing is done here.
      // We expect each item in the guides array to be a mongoDB object ID.
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // for virtual properties
    toObject: { virtuals: true },
  },
);

// INDEXING
// Storing indices for particular fields. 1 for asc order, -1 for desc
// tourSchema.index({ price: 1 }); // simple index
tourSchema.index({ price: 1, ratingsAverage: -1 }); // compund index
tourSchema.index({ slug: 1 });
// we are telling mdb that startLocation should be indexed to a 2d sphere.
tourSchema.index({ startLocation: '2dsphere' });

// VIRTUAL PROPERTIES - wont be saved in db but shows in response
tourSchema.virtual('durationWeeks').get(function () {
  // we use real function and not arrow fxn here to get acess to 'this' keyword
  return this.duration / 7;
});

// VIRTUAL POPULATE - populate review information in tour without embedding/ child referencing
tourSchema.virtual('reviews', {
  ref: 'Review', // name of the model,
  foreignField: 'tour', // name of the field in other model,
  localField: '_id', // id in current model is called 'tour' in the foreign model
});

// DOCUMENT MIDDLEWARE - runs before .save() or .create()
// This middleware below is called pre-save hook.
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next(); // calls next middleware in the stack
});

// Document middleware to embed guides to the tours doc
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   // Doing the below coz we get an array of promises
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

// post middleware - post-save hook.
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE
// pre find hook
tourSchema.pre(/^find/, function (next) {
  // This middleware should execute for all query functions starting with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// Query middleware for displaying the child referenced users in the tours response
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -passwordResetExpires -passwordResetToken',
  });
  next();
});

// Instead of below approach we can use regex as shown in the next middleware function.
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// Post find hook
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
}); // docs returned from the query

// // AGGREGATION MIDDLEWARE
// // This will run before an aggregation is executed
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }),
//     // unshift is used to add somehting at beginning of the array
//     next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
