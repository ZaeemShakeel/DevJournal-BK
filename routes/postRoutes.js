import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.get('/public', getPosts);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;