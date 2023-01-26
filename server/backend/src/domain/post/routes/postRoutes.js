import express from 'express';

import authController from '../../user/controllers/authController.js';
import postControllers from '../controllers/postControllers.js';

const router = express.Router();

router
  .route('/')
  .post(authController.authJWT, postControllers.savePost)
  .patch(authController.authJWT, postControllers.editPost);

router.route('/details/:postId').get(postControllers.getTargetPost);

router.route('/dataType/simple').get(postControllers.getSimplePostData);

// api/v1/posts/search
router.route('/search').post(postControllers.searchPost);
export default router;
