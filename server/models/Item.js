const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Documents', 'Electronics', 'Accessories', 'Clothing', 'Other'],
      default: 'Other',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Lost', 'Found', 'At Security', 'Returned'],
      default: 'Lost',
    },
    type: {
      // Whether this was reported as a lost or a found item
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;


