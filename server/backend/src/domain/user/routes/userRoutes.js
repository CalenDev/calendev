import express from 'express';
import authController from '../controllers/authController.js';
import userControllers from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(userControllers.getAllUsers);

router.route('/check-duplicate').post(userControllers.checkDuplicate);

router.route('/signup').post(userControllers.signupUser);

// 토큰정보를 기반으로 권한이 있는지 미들웨어에서 확인.
router
  .route('/signinOptions/resetPassword')
  .post(userControllers.sendResetEmail);

export default router;
