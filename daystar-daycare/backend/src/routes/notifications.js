const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Notification = require('../models/Notification');

// @route   GET api/notifications
// @desc    Get all notifications
// @access  Private (Admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/notifications/:id
// @desc    Get notification by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user has access to this notification
    if (req.user.role !== 'admin' && 
        notification.recipient.toString() !== req.user.id && 
        notification.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notifications
// @desc    Create a notification
// @access  Private (Admin, Staff)
router.post(
  '/',
  [
    auth,
    authorize('admin', 'staff'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('message', 'Message is required').not().isEmpty(),
      check('recipient', 'Recipient is required').not().isEmpty(),
      check('type', 'Notification type is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newNotification = new Notification({
        ...req.body,
        sender: req.user.id
      });
      const notification = await newNotification.save();
      res.json(notification);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/notifications/:id
// @desc    Update a notification
// @access  Private (Admin, Staff)
router.put(
  '/:id',
  [
    auth,
    authorize('admin', 'staff'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('message', 'Message is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let notification = await Notification.findById(req.params.id);

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      // Check if user is the sender
      if (notification.sender.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(notification);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/notifications/:id
// @desc    Delete a notification
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.findByIdAndRemove(req.params.id);

    res.json({ message: 'Notification removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/notifications/user/:userId
// @desc    Get notifications for a specific user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if user has access to these notifications
    if (req.user.role !== 'admin' && req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const notifications = await Notification.find({
      $or: [
        { recipient: req.params.userId },
        { sender: req.params.userId }
      ]
    })
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user is the recipient
    if (notification.recipient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true } },
      { new: true }
    );

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 