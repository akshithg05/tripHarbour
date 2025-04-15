const express = require('express');
// Multer is a Node.js middleware primarily used for handling multipart/form-data, which is the data format used
// for file uploads in web applications, making it easier to process and store uploaded files.
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// save image in this directory of our file system
// Images are notdirectly uploaded to db, we upload them to file system and then upload link
// to the image in the db.
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// Use middleware as all routes from here need to be protected
router.use(authController.protect);

router.route('/me').get(userController.getMe, userController.getUser);
router.route('/updateMyPassword').patch(authController.updatePassword);
router
  .route('/updateMe')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe,
  );
router.route('/deleteMe').delete(userController.deleteMe);

// Middleware for authorization
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
