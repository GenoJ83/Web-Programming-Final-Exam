const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Child, Babysitter, Attendance, Incident, Payment } = require('../models');
const { auth, isManager } = require('../middleware/auth.middleware');

// Validation middleware
const validateChild = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('age').isInt({ min: 0, max: 12 }).withMessage('Age must be between 0 and 12'),
  body('parentName').trim().notEmpty().withMessage('Parent name is required'),
  body('parentPhone').trim().notEmpty().withMessage('Parent phone is required'),
  body('parentEmail').optional().isEmail().withMessage('Please enter a valid email'),
  body('sessionType').isIn(['half-day', 'full-day']).withMessage('Invalid session type'),
  body('babysitterId').isInt().withMessage('Valid babysitter ID is required')
];

// Get all children (manager only)
router.get('/', [auth, isManager], async (req, res) => {
  try {
    const children = await Child.findAll({
      include: [
        {
          model: Babysitter,
          as: 'babysitter',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      status: 'success',
      data: { children }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching children',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Register new child (manager only)
router.post('/', [auth, isManager, validateChild], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const childData = req.body;

    // Check if babysitter exists and is active
    const babysitter = await Babysitter.findOne({
      where: {
        id: childData.babysitterId,
        isActive: true
      }
    });

    if (!babysitter) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or inactive babysitter'
      });
    }

    // Create new child
    const child = await Child.create(childData);

    res.status(201).json({
      status: 'success',
      data: { child }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get child by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.id, {
      include: [
        {
          model: Babysitter,
          as: 'babysitter',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Attendance,
          as: 'attendance',
          attributes: ['id', 'date', 'checkIn', 'checkOut', 'status']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['id', 'amount', 'paymentDate', 'status']
        }
      ]
    });

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      });
    }

    res.json({
      status: 'success',
      data: { child }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update child (manager only)
router.patch('/:id', [auth, isManager, validateChild], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      });
    }

    await child.update(req.body);

    res.json({
      status: 'success',
      data: { child }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete child (manager only)
router.delete('/:id', [auth, isManager], async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      });
    }

    // Soft delete by setting isActive to false
    await child.update({ isActive: false });

    res.json({
      status: 'success',
      message: 'Child deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Record child attendance
router.post('/:id/attendance', auth, [
  body('checkIn').notEmpty().withMessage('Check-in time is required'),
  body('sessionType').isIn(['half-day', 'full-day']).withMessage('Invalid session type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      });
    }

    const attendance = await Attendance.create({
      childId: child.id,
      babysitterId: req.user.role === 'babysitter' ? req.user.id : null,
      checkIn: req.body.checkIn,
      sessionType: req.body.sessionType,
      date: new Date()
    });

    res.status(201).json({
      status: 'success',
      data: { attendance }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error recording attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Record child check-out
router.patch('/:id/attendance/:attendanceId', auth, [
  body('checkOut').notEmpty().withMessage('Check-out time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const attendance = await Attendance.findOne({
      where: {
        id: req.params.attendanceId,
        childId: req.params.id,
        checkOut: null
      }
    });

    if (!attendance) {
      return res.status(404).json({
        status: 'error',
        message: 'Attendance record not found or already checked out'
      });
    }

    await attendance.update({
      checkOut: req.body.checkOut
    });

    res.json({
      status: 'success',
      data: { attendance }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error recording check-out',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Report incident for child
router.post('/:id/incidents', auth, [
  body('type').isIn(['health', 'behavior', 'safety', 'other']).withMessage('Invalid incident type'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      });
    }

    const incident = await Incident.create({
      childId: child.id,
      reportedBy: req.user.id,
      ...req.body
    });

    res.status(201).json({
      status: 'success',
      data: { incident }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error reporting incident',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 