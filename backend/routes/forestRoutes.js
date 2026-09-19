import { Router } from 'express';
import {
  createForest,
  deleteForest,
  getForestById,
  getForests,
  updateForest,
} from '../controllers/forestController.js';

const router = Router();

router.route('/').get(getForests).post(createForest);
router.route('/:id').get(getForestById).put(updateForest).delete(deleteForest);

export default router;