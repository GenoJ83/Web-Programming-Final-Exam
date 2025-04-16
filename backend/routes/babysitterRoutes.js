const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.MARIADBPASSWORD,
  database: process.env.DB_NAME
});

// Register a new babysitter
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('nin').notEmpty().withMessage('National ID is required'),
  body('age').isInt({ min: 21, max: 35 }).withMessage('Age must be between 21 and 35'),
  body('nextOfKinName').notEmpty().withMessage('Next of kin name is required'),
  body('nextOfKinPhone').notEmpty().withMessage('Next of kin phone is required'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('qualifications').notEmpty().withMessage('Qualifications are required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    nin,
    age,
    nextOfKinName,
    nextOfKinPhone,
    hourlyRate,
    experience,
    qualifications
  } = req.body;

  try {
    // Check if babysitter with same NIN already exists
    const [existingBabysitter] = await pool.query(
      'SELECT * FROM babysitters WHERE nin = ?',
      [nin]
    );

    if (existingBabysitter.length > 0) {
      return res.status(400).json({ message: 'Babysitter with this National ID already exists' });
    }

    // Insert new babysitter
    const [result] = await pool.query(
      `INSERT INTO babysitters (
        firstName, lastName, email, phoneNumber, nin, age,
        nextOfKinName, nextOfKinPhone, hourlyRate, experience, qualifications
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName, lastName, email, phoneNumber, nin, age,
        nextOfKinName, nextOfKinPhone, hourlyRate, experience, qualifications
      ]
    );

    const [newBabysitter] = await pool.query(
      'SELECT * FROM babysitters WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newBabysitter[0]);
  } catch (error) {
    console.error('Error registering babysitter:', error);
    res.status(500).json({ message: 'Error registering babysitter' });
  }
});

// Get all babysitters
router.get('/', async (req, res) => {
  try {
    const [babysitters] = await pool.query('SELECT * FROM babysitters ORDER BY id DESC');
    res.json(babysitters);
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    res.status(500).json({ message: 'Error fetching babysitters' });
  }
});

// Get babysitter by ID
router.get('/:id', async (req, res) => {
  try {
    const [babysitter] = await pool.query(
      'SELECT * FROM babysitters WHERE id = ?',
      [req.params.id]
    );

    if (babysitter.length === 0) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }

    res.json(babysitter[0]);
  } catch (error) {
    console.error('Error fetching babysitter:', error);
    res.status(500).json({ message: 'Error fetching babysitter' });
  }
});

// Update babysitter
router.put('/:id', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    hourlyRate,
    experience,
    qualifications,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE babysitters SET
        firstName = ?,
        lastName = ?,
        email = ?,
        phoneNumber = ?,
        hourlyRate = ?,
        experience = ?,
        qualifications = ?,
        status = ?
      WHERE id = ?`,
      [
        firstName,
        lastName,
        email,
        phoneNumber,
        hourlyRate,
        experience,
        qualifications,
        status,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }

    const [updatedBabysitter] = await pool.query(
      'SELECT * FROM babysitters WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedBabysitter[0]);
  } catch (error) {
    console.error('Error updating babysitter:', error);
    res.status(500).json({ message: 'Error updating babysitter' });
  }
});

// Delete babysitter
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM babysitters WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }

    res.json({ message: 'Babysitter deleted successfully' });
  } catch (error) {
    console.error('Error deleting babysitter:', error);
    res.status(500).json({ message: 'Error deleting babysitter' });
  }
});

module.exports = router; 