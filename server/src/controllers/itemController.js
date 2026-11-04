import mongoose from 'mongoose';
import Item from '../models/Item.js';

// Build the object we send to the client (no owner, no storageKey)
function toItem(item) {
  return {
    id: item._id,
    name: item.name,
    type: item.type,
    parent: item.parent,
    size: item.size,
    mimeType: item.mimeType,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function createFolder(req, res) {
  try {
    // Read the body safely (it can be undefined if no JSON was sent)
    const { name, parent } = req.body || {};

    // Types first, so .trim() never runs on a number
    if (typeof name !== 'string') {
      return res.status(400).json({ message: 'Name must be text' });
    }

    const cleanName = name.trim();
    if (!cleanName) {
      return res.status(400).json({ message: 'Collection name is required' });
    }

    // parent is optional: missing or null means top level
    let parentId = null;
    if (parent !== undefined && parent !== null) {
      // Must look like an id, otherwise Mongoose would throw a cast error
      if (!mongoose.isValidObjectId(parent)) {
        return res.status(400).json({ message: 'Parent is not a valid id' });
      }

      // One query: exists + is mine + is a collection
      const parentItem = await Item.findOne({
        _id: parent,
        owner: req.userId,
        type: 'folder',
      });

      // Same 404 for every failure, so nothing leaks about other users' items
      if (!parentItem) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      parentId = parentItem._id;
    }

    // The owner comes from the token, never from the request body
    const item = await Item.create({
      owner: req.userId,
      name: cleanName,
      type: 'folder',
      parent: parentId,
    });

    return res.status(201).json({ item: toItem(item) });
  } catch (error) {
    // The unique index (owner + parent + name) rejected a duplicate name
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'A collection with this name already exists here',
      });
    }
    console.error('Create collection failed:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}