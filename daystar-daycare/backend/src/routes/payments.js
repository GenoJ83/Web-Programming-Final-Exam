const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Payment = require('../models/Payment');

// @route   GET api/payments
// @desc    Get all payments
// @access  Private (Admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('parent', 'firstName lastName email')
      .sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('parent', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user has access to this payment
    if (req.user.role !== 'admin' && payment.parent.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/payments
// @desc    Create a payment
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    authorize('admin'),
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('parent', 'Parent is required').not().isEmpty(),
      check('type', 'Payment type is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newPayment = new Payment(req.body);
      const payment = await newPayment.save();
      res.json(payment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/payments/:id
// @desc    Update a payment
// @access  Private (Admin)
router.put(
  '/:id',
  [
    auth,
    authorize('admin'),
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('type', 'Payment type is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      payment = await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(payment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/payments/:id
// @desc    Delete a payment
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await Payment.findByIdAndRemove(req.params.id);

    res.json({ message: 'Payment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payments/parent/:parentId
// @desc    Get payments by parent
// @access  Private
router.get('/parent/:parentId', auth, async (req, res) => {
  try {
    // Check if user has access to these payments
    if (req.user.role !== 'admin' && req.params.parentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const payments = await Payment.find({ parent: req.params.parentId })
      .sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payments/pending
// @desc    Get pending payments
// @access  Private (Admin)
router.get('/pending', auth, authorize('admin'), async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('parent', 'firstName lastName email')
      .sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 