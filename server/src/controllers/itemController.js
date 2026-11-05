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

function cleanItemName(name) {
  if (typeof name !== 'string') {
    return { message: 'Name must be text' };
  }
  const value = name.trim();
  if (!value) {
    return { message: 'Name is required' };
  }
  if (value.includes('/')) {
    return { message: 'Name cannot contain "/"' };
  }
  return { value };
}

// One query: exists + is mine + is a collection (the id must already be valid)
function findOwnedFolder(owner, id) {
  return Item.findOne({ _id: id, owner, type: 'folder' });
}

async function isAncestorOrSelf(owner, itemId, startId) {
  let current = startId;
  // Safety limit, so bad data can never hang the server
  for (let steps = 0; current && steps < 1000; steps++) {
    // Compare as text: two ObjectIds are never === even when equal
    if (String(current) === String(itemId)) {
      return true;
    }
    const folder = await findOwnedFolder(owner, current);
    current = folder ? folder.parent : null;
  }
  return false;
}

export async function createFolder(req, res) {
  try {
    // Read the body safely (it can be undefined if no JSON was sent)
    const { name, parent } = req.body || {};

    const cleaned = cleanItemName(name);
    if (cleaned.message) {
      return res.status(400).json({ message: cleaned.message });
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
      name: cleaned.value,
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

export async function updateItem(req, res) {
  try {
    const { id } = req.params;
    // Read the body safely (it can be undefined if no JSON was sent)
    const { name, parent } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }

    // undefined = "leave it alone"; there must be something to change
    if (name === undefined && parent === undefined) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    // Owner in the query: someone else's item looks like a missing one
    const item = await Item.findOne({ _id: id, owner: req.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Rename (only if the client sent a name)
    if (name !== undefined) {
      const cleaned = cleanItemName(name);
      if (cleaned.message) {
        return res.status(400).json({ message: cleaned.message });
      }
      item.name = cleaned.value;
    }

    // Move (only if the client sent a parent; null means top level)
    if (parent !== undefined) {
      if (parent === null) {
        item.parent = null;
      } else {
        if (!mongoose.isValidObjectId(parent)) {
          return res.status(400).json({ message: 'Parent is not a valid id' });
        }

        const target = await findOwnedFolder(req.userId, parent);
        if (!target) {
          return res.status(404).json({ message: 'Collection not found' });
        }

      
        if (
          item.type === 'folder' &&
          (await isAncestorOrSelf(req.userId, item._id, target._id))
        ) {
          return res.status(400).json({
            message: 'Cannot move a collection into itself or one inside it',
          });
        }

        item.parent = target._id;
      }
    }

    // save() runs the schema rules and the unique index
    await item.save();

    return res.status(200).json({ item: toItem(item) });
  } catch (error) {
    // The unique index (owner + parent + name) rejected a duplicate name
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An item with this name already exists here',
      });
    }
    console.error('Update item failed:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}