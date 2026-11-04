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

// One query: exists + is mine + is a collection (the id must already be valid)
function findOwnedFolder(owner, id) {
  return Item.findOne({ _id: id, owner, type: 'folder' });
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

      const parentItem = await findOwnedFolder(req.userId, parent);

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

export async function listItems(req, res) {
  try {
    // Query string values are text, but can also be arrays (?parent=a&parent=b)
    const { parent } = req.query;

    // No parent in the URL means top level (null in the database)
    let parentId = null;
    if (parent !== undefined) {
      if (typeof parent !== 'string' || !mongoose.isValidObjectId(parent)) {
        return res.status(400).json({ message: 'Parent is not a valid id' });
      }

      const parentFolder = await findOwnedFolder(req.userId, parent);

      // Same 404 for every failure, so nothing leaks about other users' items
      if (!parentFolder) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      parentId = parentFolder._id;
    }

    const items = await Item.find({ owner: req.userId, parent: parentId })
      .sort({ type: -1, name: 1 })
      .collation({ locale: 'en', strength: 2 });

    return res.status(200).json({ items: items.map(toItem) });
  } catch (error) {
    console.error('List items failed:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}