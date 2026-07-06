import { Router } from 'express';
import { analyzeCrop, getReport, simulateScenario } from '../controllers/analysisController';
import { upload } from '../middlewares/upload';

const router = Router();

// Routes
router.post('/analyze', upload.single('image'), analyzeCrop);
router.post('/simulate', simulateScenario);
router.get('/reports/:id', getReport);

export default router;
