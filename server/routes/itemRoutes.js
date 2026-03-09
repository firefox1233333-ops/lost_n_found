const express = require('express');
const Item = require('../models/Item');
const { requireAuth, requireAdmin, requireAdminOrSecurity } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/items
// @desc    Create a lost or found item (type: 'lost' | 'found')
// @access  Private (logged-in users)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, category, location, date, imageUrl, type, status } = req.body;

    if (!title || !description || !location || !date || !type) {
      return res.status(400).json({
        message: 'Title, description, location, date, and type are required',
      });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'lost' or 'found'" });
    }

    const allowedStatuses = ['Lost', 'Found', 'At Security', 'Returned'];
    const initialStatus =
      status && allowedStatuses.includes(status) ? status : undefined;

    const item = await Item.create({
      title,
      description,
      category: category || 'Other',
      location,
      date,
      imageUrl: imageUrl || '',
      type,
      status: initialStatus, // falls back to schema default if undefined
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

// @route   GET /api/items/my-reports
// @desc    Get items reported by the logged-in user only (requires auth)
// @access  Private
router.get('/my-reports', requireAuth, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get my-reports error:', error.message);
    res.status(500).json({ message: 'Server error while fetching your reports' });
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

    if (status && ['Lost', 'Found', 'At Security', 'Returned'].includes(status)) {
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
    const item = await Item.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('claimedBy', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error.message);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
});

// @route   POST /api/items/:id/claim
// @desc    Claim a found item (user)
// @access  Private/User
router.post('/:id/claim', requireAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.type !== 'found') {
      return res.status(400).json({ message: 'Only found items can be claimed' });
    }

    if (item.claimedBy && String(item.claimedBy) !== String(req.user._id)) {
      return res.status(400).json({ message: 'This item has already been claimed by another user' });
    }

    item.claimedBy = req.user._id;
    item.claimStatus = 'Pending';
    await item.save();

    res.json({
      message: 'Claim submitted successfully',
      item,
    });
  } catch (error) {
    console.error('Claim item error:', error.message);
    res.status(500).json({ message: 'Server error while claiming item' });
  }
});

// @route   PUT /api/items/:id/status
// @desc    Update item status (Admin or Security)
// @access  Private/Admin or Security
router.put('/:id/status', requireAuth, requireAdminOrSecurity, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Lost', 'Found', 'At Security', 'Returned'].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'Lost', 'Found', 'At Security', or 'Returned'" });
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


