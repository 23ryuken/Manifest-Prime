import express from 'express';
import { createFolder } from '../controllers/itemController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/folder', requireAuth, createFolder);

export default router;