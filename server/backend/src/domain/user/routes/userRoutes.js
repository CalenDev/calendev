import express from 'express';
import authControllers from '../controllers/authController.js';
import userControllers from '../controllers/userController.js';

const router = express.Router();

router
  .route('/profile')
  .get(authControllers.authJWT, userControllers.getUserProfile);

router.route('/').post(userControllers.signupUser);

router
  .route('/password')
  .post(authControllers.authJWT, authControllers.resetPassword);

router
  .route('/password/:token')
  .patch(authControllers.resetPasswordWithPageToken);

router.route('/:token').delete(userControllers.withdrawUser);

router
  .route('/signinOptions/forgotPassword')
  .post(authControllers.sendResetEmail);

export default router;
