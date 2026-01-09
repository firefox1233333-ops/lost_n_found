const express = require('express');
const Item = require('../models/Item');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/items
// @desc    Create a lost or found item (type: 'lost' | 'found')
// @access  Private (logged-in users)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, category, location, date, imageUrl, type } = req.body;

    if (!title || !description || !location || !date || !type) {
      return res.status(400).json({
        message: 'Title, description, location, date, and type are required',
      });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'lost' or 'found'" });
    }

    const item = await Item.create({
      title,
      description,
      category: category || 'Other',
      location,
      date,
      imageUrl: imageUrl || '',
      type,
      // status defaults to 'Lost' in schema
      userId: req.user._id,
    });

    res.status(201).json({
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    console.error('Create item error:', error.message);
    res.status(500).json({ message: 'Server error while creating item' });
  }
});

// @route   GET /api/items
// @desc    Get all items with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, status, category, location, search } = req.query;

    const filters = {};

    if (type && ['lost', 'found'].includes(type)) {
      filters.type = type;
    }

    if (status && ['Lost', 'Found', 'Returned'].includes(status)) {
      filters.status = status;
    }

    if (category) {
      filters.category = category;
    }

    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(filters)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error.message);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error.message);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
});

// @route   PUT /api/items/:id/status
// @desc    Update item status (Admin only)
// @access  Private/Admin
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Lost', 'Found', 'Returned'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Lost', 'Found', or 'Returned'" });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = status;
    await item.save();

    res.json({
      message: 'Item status updated successfully',
      item,
    });
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({ message: 'Server error while updating status' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item (Admin only)
// @access  Private/Admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error.message);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
});

module.exports = router;


