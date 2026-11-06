import multer from 'multer';
import { UPLOAD_DIR, newStorageKey } from '../services/storage.service.js';

// 25 MB, enforced on the server
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

// Write straight to disk, under a name WE choose
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, newStorageKey()),
});

const upload = multer({ storage, limits: { fileSize: MAX_UPLOAD_BYTES } });

// it runs multer, and turn its errors into our JSON { message } format
export function handleUpload(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (error) {
      // The file is bigger than the limit
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File is too large' });
      }
      // Multer's own complaints (wrong field name, too many files): client's fault
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Upload failed' });
      }
      // Anything else (disk full, missing folder) is OUR problem
      console.error('Upload failed:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
    next();
  });
}