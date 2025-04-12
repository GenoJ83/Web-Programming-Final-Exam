const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Child = require('../models/Child');

// @route   GET api/children
// @desc    Get all children
// @access  Private (Admin, Staff)
router.get('/', [auth, authorize('admin', 'staff')], async (req, res) => {
  try {
    const children = await Child.find()
      .populate('parent', 'firstName lastName email phoneNumber')
      .populate('assignedStaff', 'firstName lastName email')
      .sort({ firstName: 1 });
    res.json(children);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/children/:id
// @desc    Get child by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const child = await Child.findById(req.params.id)
      .populate('parent', 'firstName lastName email phoneNumber')
      .populate('assignedStaff', 'firstName lastName email');

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Check if user is admin, staff, or parent of the child
    if (req.user.role === 'parent' && child.parent.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(child);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/children
// @desc    Create a child
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    authorize('admin'),
    [
      check('firstName', 'First name is required').not().isEmpty(),
      check('lastName', 'Last name is required').not().isEmpty(),
      check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
      check('parent', 'Parent ID is required').not().isEmpty(),
      check('assignedStaff', 'Assigned staff ID is required').not().isEmpty(),
      check('allergies', 'Allergies field is required').isArray(),
      check('medications', 'Medications field is required').isArray(),
      check('emergencyContacts', 'Emergency contacts are required').isArray(),
      check('emergencyContacts.*.name', 'Emergency contact name is required').not().isEmpty(),
      check('emergencyContacts.*.relation', 'Emergency contact relation is required').not().isEmpty(),
      check('emergencyContacts.*.phone', 'Emergency contact phone is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newChild = new Child(req.body);
      const child = await newChild.save();

      const populatedChild = await Child.findById(child._id)
        .populate('parent', 'firstName lastName email phoneNumber')
        .populate('assignedStaff', 'firstName lastName email');

      res.json(populatedChild);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/children/:id
// @desc    Update a child
// @access  Private (Admin)
router.put(
  '/:id',
  [
    auth,
    authorize('admin'),
    [
      check('firstName', 'First name is required').not().isEmpty(),
      check('lastName', 'Last name is required').not().isEmpty(),
      check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
      check('parent', 'Parent ID is required').not().isEmpty(),
      check('assignedStaff', 'Assigned staff ID is required').not().isEmpty(),
      check('allergies', 'Allergies field is required').isArray(),
      check('medications', 'Medications field is required').isArray(),
      check('emergencyContacts', 'Emergency contacts are required').isArray(),
      check('emergencyContacts.*.name', 'Emergency contact name is required').not().isEmpty(),
      check('emergencyContacts.*.relation', 'Emergency contact relation is required').not().isEmpty(),
      check('emergencyContacts.*.phone', 'Emergency contact phone is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let child = await Child.findById(req.params.id);

      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      child = await Child.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      )
        .populate('parent', 'firstName lastName email phoneNumber')
        .populate('assignedStaff', 'firstName lastName email');

      res.json(child);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/children/:id
// @desc    Delete a child
// @access  Private (Admin)
router.delete('/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    await Child.findByIdAndRemove(req.params.id);

    res.json({ message: 'Child removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/children/parent/:parentId
// @desc    Get children by parent ID
// @access  Private
router.get('/parent/:parentId', auth, async (req, res) => {
  try {
    // Check if user is admin or the parent
    if (req.user.role === 'parent' && req.params.parentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const children = await Child.find({ parent: req.params.parentId })
      .populate('parent', 'firstName lastName email phoneNumber')
      .populate('assignedStaff', 'firstName lastName email')
      .sort({ firstName: 1 });

    res.json(children);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/children/staff/:staffId
// @desc    Get children assigned to staff member
// @access  Private (Admin, Staff)
router.get('/staff/:staffId', [auth, authorize('admin', 'staff')], async (req, res) => {
  try {
    // If staff member, can only view their assigned children
    if (req.user.role === 'staff' && req.params.staffId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const children = await Child.find({ assignedStaff: req.params.staffId })
      .populate('parent', 'firstName lastName email phoneNumber')
      .populate('assignedStaff', 'firstName lastName email')
      .sort({ firstName: 1 });

    res.json(children);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 