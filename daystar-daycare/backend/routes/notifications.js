const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get user's notifications
router.get('/', auth, async (req, res) => {
    try {
        const { status, priority } = req.query;
        let query = { recipient: req.user._id };

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unread notifications count
router.get('/unread-count', auth, async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            status: { $in: ['pending', 'sent', 'delivered'] }
        });

        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.markAsRead();
        res.json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark all notifications as read
router.patch('/read-all', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user._id,
                status: { $in: ['pending', 'sent', 'delivered'] }
            },
            {
                $set: {
                    status: 'read',
                    readAt: new Date()
                }
            }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create notification (internal use)
router.post('/', auth, async (req, res) => {
    try {
        const {
            recipient,
            recipientModel,
            type,
            title,
            message,
            priority,
            metadata
        } = req.body;

        const notification = new Notification({
            recipient,
            recipientModel,
            type,
            title,
            message,
            priority,
            metadata
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 