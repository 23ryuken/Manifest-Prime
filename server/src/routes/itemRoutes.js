import express from 'express';
import { createFolder, listItems, updateItem, deleteItem, uploadFile, downloadItem } from '../controllers/itemController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { handleUpload } from '../middleware/upload.js';

const router = express.Router();

router.use(requireAuth);

router.post('/folder', createFolder);
router.get('/', listItems);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/upload', handleUpload, uploadFile);
router.get('/:id/download', downloadItem);

export default router;