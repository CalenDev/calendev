import express from 'express';

import userControllers from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(userControllers.getAllUsers);

router.route('/check-duplicate').post(userControllers.checkDuplicate);

router.route('/signup').post(userControllers.signupUser);

export default router;
