import express from 'express';
import { createFolder, listItems, updateItem, deleteItem } from '../controllers/itemController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/folder', createFolder);
router.get('/', listItems);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;