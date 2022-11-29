import express from 'express';

import authControllers from '../controllers/authController.js';

const router = express.Router();

router.route('/login').post(authControllers.userLogIn);

export default router;
