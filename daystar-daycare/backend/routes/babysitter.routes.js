const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Babysitter, User, Child, Payment, Attendance } = require('../models');
const { auth, isManager } = require('../middleware/auth.middleware');

// Validation middleware
const validateBabysitter = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
  body('nin').trim().notEmpty().withMessage('NIN is required'),
  body('age').isInt({ min: 21, max: 35 }).withMessage('Age must be between 21 and 35'),
  body('nextOfKinName').trim().notEmpty().withMessage('Next of kin name is required'),
  body('nextOfKinPhone').trim().notEmpty().withMessage('Next of kin phone is required')
];

// Get all babysitters (manager only)
router.get('/', [auth, isManager], async (req, res) => {
  try {
    const babysitters = await Babysitter.findAll({
      include: [
        {
          model: Child,
          as: 'children',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      status: 'success',
      data: { babysitters }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching babysitters',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Register new babysitter (manager only)
router.post('/', [auth, isManager, validateBabysitter], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const babysitterData = req.body;

    // Check if babysitter with same NIN exists
    const existingBabysitter = await Babysitter.findOne({
      where: { nin: babysitterData.nin }
    });

    if (existingBabysitter) {
      return res.status(400).json({
        status: 'error',
        message: 'Babysitter with this NIN already exists'
      });
    }

    // Create new babysitter
    const babysitter = await Babysitter.create(babysitterData);

    res.status(201).json({
      status: 'success',
      data: { babysitter }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating babysitter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get babysitter by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const babysitter = await Babysitter.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'children',
          attributes: ['id', 'firstName', 'lastName', 'age']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['id', 'amount', 'paymentDate', 'status']
        }
      ]
    });

    if (!babysitter) {
      return res.status(404).json({
        status: 'error',
        message: 'Babysitter not found'
      });
    }

    res.json({
      status: 'success',
      data: { babysitter }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching babysitter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update babysitter (manager only)
router.patch('/:id', [auth, isManager, validateBabysitter], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const babysitter = await Babysitter.findByPk(req.params.id);

    if (!babysitter) {
      return res.status(404).json({
        status: 'error',
        message: 'Babysitter not found'
      });
    }

    await babysitter.update(req.body);

    res.json({
      status: 'success',
      data: { babysitter }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating babysitter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete babysitter (manager only)
router.delete('/:id', [auth, isManager], async (req, res) => {
  try {
    const babysitter = await Babysitter.findByPk(req.params.id);

    if (!babysitter) {
      return res.status(404).json({
        status: 'error',
        message: 'Babysitter not found'
      });
    }

    // Soft delete by setting isActive to false
    await babysitter.update({ isActive: false });

    res.json({
      status: 'success',
      message: 'Babysitter deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting babysitter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get babysitter's daily payments (manager only)
router.get('/:id/payments', [auth, isManager], async (req, res) => {
  try {
    const { date } = req.query;
    const where = {
      babysitterId: req.params.id,
      paymentType: 'babysitter'
    };

    if (date) {
      where.paymentDate = date;
    }

    const payments = await Payment.findAll({
      where,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get babysitter's attendance (manager only)
router.get('/:id/attendance', [auth, isManager], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {
      babysitterId: req.params.id
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const attendance = await Attendance.findAll({
      where,
      order: [['date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: { attendance }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 