const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Child = require('../models/Child');
const Notification = require('../models/Notification');

// Register new child
router.post('/', auth, authorize('manager'), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            parent,
            specialNeeds,
            enrollment
        } = req.body;

        const child = new Child({
            firstName,
            lastName,
            dateOfBirth,
            parent,
            specialNeeds,
            enrollment
        });

        await child.save();
        res.status(201).json(child);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all children
router.get('/', auth, async (req, res) => {
    try {
        const children = await Child.find();
        res.json(children);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get child by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }
        res.json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record child attendance
router.post('/:id/attendance', auth, async (req, res) => {
    try {
        const { checkIn, checkOut, sessionType, babysitter } = req.body;
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const attendance = {
            date: new Date(),
            checkIn,
            checkOut,
            sessionType,
            babysitter
        };

        child.attendance.push(attendance);
        await child.save();

        // Create notification for parent
        const notification = new Notification({
            recipient: child._id,
            recipientModel: 'Child',
            type: checkIn ? 'child_check_in' : 'child_check_out',
            title: checkIn ? 'Child Check-in' : 'Child Check-out',
            message: `${child.firstName} ${child.lastName} has been ${checkIn ? 'checked in' : 'checked out'}`,
            metadata: {
                childId: child._id,
                checkInTime: checkIn,
                checkOutTime: checkOut
            }
        });

        await notification.save();

        res.json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Report incident
router.post('/:id/incidents', auth, async (req, res) => {
    try {
        const { type, description } = req.body;
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const incident = {
            date: new Date(),
            type,
            description,
            reportedBy: req.user._id
        };

        child.incidents.push(incident);
        await child.save();

        // Create notification for manager
        const notification = new Notification({
            recipient: child._id,
            recipientModel: 'Child',
            type: 'incident_report',
            title: 'Incident Report',
            message: `Incident reported for ${child.firstName} ${child.lastName}: ${description}`,
            priority: 'high',
            metadata: {
                childId: child._id,
                incidentType: type,
                description
            }
        });

        await notification.save();

        res.json(incident);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update child information
router.patch('/:id', auth, authorize('manager'), async (req, res) => {
    try {
        const updates = req.body;
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        Object.keys(updates).forEach(update => {
            child[update] = updates[update];
        });

        await child.save();
        res.json(child);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get child attendance history
router.get('/:id/attendance', auth, async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { startDate, endDate } = req.query;
        let attendance = child.attendance;

        if (startDate && endDate) {
            attendance = attendance.filter(a => 
                a.date >= new Date(startDate) && 
                a.date <= new Date(endDate)
            );
        }

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get child incidents
router.get('/:id/incidents', auth, async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { status } = req.query;
        let incidents = child.incidents;

        if (status) {
            incidents = incidents.filter(i => i.status === status);
        }

        res.json(incidents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 