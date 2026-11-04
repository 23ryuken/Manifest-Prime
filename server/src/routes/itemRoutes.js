import express from 'express';
import { createFolder, listItems } from '../controllers/itemController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/folder', createFolder);
router.get('/', listItems);

export default router;