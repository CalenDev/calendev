import express from 'express';
import authControllers from '../controllers/authController.js';
import userControllers from '../controllers/userController.js';

const router = express.Router();

router.route('/login').post(authControllers.userLogIn);

router.route('/refresh').get(authControllers.refreshJWT);

// 토큰정보를 기반으로 권한이 있는지 미들웨어에서 확인.
router
  .route('/signinOptions/forgotPassword')
  .post(authControllers.sendResetEmail);

router
  .route('/signinOptions/resetPassword/:token')
  .patch(authControllers.resetPassword);

router.route('/').get(userControllers.getAllUsers);

router.route('/check-duplicate').post(userControllers.checkDuplicate);

router.route('/signup').post(userControllers.signupUser);

export default router;
