import express from 'express';

import authControllers from '../controllers/authController.js';
import userControllers from '../controllers/userController.js';

const router = express.Router();

router.route('/login').post(authControllers.userLogIn);

router.route('/refresh').get(authControllers.refreshJWT);

router.route('/page/:token').get(authControllers.validateResetPage);

router.route('/duplicate').post(userControllers.checkDuplicate);

export default router;
