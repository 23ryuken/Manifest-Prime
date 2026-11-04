import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    type: {
      type: String,
      required: true,
      enum: ['folder', 'file'],
    },
    
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null,
    },
    
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: '',
    },
    
    storageKey: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

itemSchema.index({ owner: 1, parent: 1, name: 1 }, { unique: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;