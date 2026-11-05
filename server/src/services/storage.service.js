import fs from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"

// This file's own folder, so the path never depends on where node was started
const thisFolder = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(thisFolder, "..", "..", "uploads");

// create the folder if it is missing
export async function ensureUploadDir() {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

// a new random id (a UUID)
export function newStorageKey() {
    return crypto.randomUUID();
}

// the full path of the file
export function pathFor(storageKey) {
    if (
        typeof storageKey !== 'string' ||
        storageKey === '' ||
        storageKey === '.' ||
        storageKey === '..' ||
        path.basename(storageKey) !== storageKey
    ) {
        throw new Error('Invalid storage key');
    }
    return path.join(UPLOAD_DIR, storageKey);
}

// delete the file
export async function removeStored(storageKey) {
  try {
    await fs.unlink(pathFor(storageKey));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}