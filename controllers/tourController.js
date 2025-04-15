const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// for many fields with single/multiple images
exports.uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

// for one field - upload.single , this returns req.file
// for one field with multiple images - upload.array - this gives req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) next();

  // 1) Cover Image

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  // We set the images to req.body because in the next middleware it will be PATCHed properly
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );
  next();
});

//middleware for top 5 cheapest tours
exports.alaisTopCheapest = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'ratingsAverage,-price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // Aggregate on all documents having rating 4.5
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // Create group by difficulty and make it uppercase
        numTours: { $sum: 1 }, // Add 1 for every tour document which is aggregated by difficulty (total documents)
        numRatings: { $sum: '$ratingsQuantity' }, // Sum of all the ratings
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // Sort all the stat document groups by average price in 1( ascending order)
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, // Exclude the groups which are easy
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats: stats,
    },
  });
});

exports.getTourPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // It will create one document for every element in the startDates array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // fetch the month from the date and group by month
        numTours: { $sum: 1 },
        tours: { $push: '$name' }, // push the name of the tours which are in that month and the given year
      },
    },
    {
      $addFields: {
        // used to add fields
        month: '$_id', // add a field month with value of the _id which is representing the month
      },
    },
    {
      $project: {
        _id: 0, // Do not include _id in the result (0 is for exclude , 1 include only _id)
      },
    },
    {
      $sort: { numTours: -1 }, // sort in desc order of the number of tours
    },
    {
      $limit: 12, // Limit the number of docs being shown
    },
  ]);

  res.status(200).json({
    status: 'success',
    count: plan.length,
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    new AppError('Please provide lat and lng in the format lat,lng.', 400);
  }

  // geoWithin - finds documents within a certain geometry.
  // Here find the startLocation within the sphere of radius of distance(in radians) specified and center specified.
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  console.log(lat, lng, unit);

  if (!lat || !lng) {
    new AppError('Please provide lat and lng in the format lat,lng.', 400);
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        // all distances will be calculated from this near(point that we pass) to the tour start locations
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance', // name of the field
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
