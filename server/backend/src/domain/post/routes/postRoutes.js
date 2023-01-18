import express from 'express';

import authController from '../../user/controllers/authController.js';
import postControllers from '../controllers/postControllers.js';

const router = express.Router();

router
  .route('/')
  .post(authController.authJWT, postControllers.savePost)
  .patch(authController.authJWT, postControllers.editPost);

router
  .route('/details')
  .get(authController.authJWT, postControllers.getTargetPost);

router.route('/dataType/simple').get(postControllers.getSimplePostData);
export default router;
