import fs from 'node:fs/promises';
import {
  ensureUploadDir,
  newStorageKey,
  pathFor,
  removeStored,
} from './src/services/storage.service.js';

// 1. Make sure the uploads folder exists
await ensureUploadDir();
console.log('uploads folder is ready');

// 2. A new random key and the path it maps to
const key = newStorageKey();
console.log('key  :', key);
console.log('path :', pathFor(key));

// 3. Bad keys must be refused
for (const bad of ['../x', '..', '']) {
  try {
    pathFor(bad);
    console.log(JSON.stringify(bad), '-> ACCEPTED (this is a bug)');
  } catch (error) {
    console.log(JSON.stringify(bad), '-> refused:', error.message);
  }
}

// 4. Write a small file, then check it is there
await fs.writeFile(pathFor(key), 'hello');
console.log('files in uploads:', await fs.readdir('uploads'));

// 5. Remove it, then remove it again (the second call must not fail)
await removeStored(key);
console.log('after first remove:', await fs.readdir('uploads'));
await removeStored(key);
console.log('second remove: no error');