import express from 'express';
import authControllers from '../controllers/authController.js';
import userControllers from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(authControllers.authJWT, userControllers.getAllUsers);

router.route('/').post(userControllers.signupUser);

router.route('/password/:token').patch(authControllers.resetPassword);

router.route('/:token').delete(userControllers.withdrawUser);

router
  .route('/signinOptions/forgotPassword')
  .post(authControllers.sendResetEmail);

export default router;
