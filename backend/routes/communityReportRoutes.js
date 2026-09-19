import { Router } from 'express';
import {
  createReport,
  deleteReport,
  getReportById,
  getReports,
  updateReport,
} from '../controllers/communityReportController.js';

const router = Router();

router.route('/').get(getReports).post(createReport);
router.route('/:id').get(getReportById).put(updateReport).delete(deleteReport);

export default router;