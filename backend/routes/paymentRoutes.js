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

// Constants for payment rates
const HALF_DAY_RATE = 2000;
const FULL_DAY_RATE = 5000;

// Calculate payment for a babysitter
router.post('/calculate', [
  body('babysitterId').isInt().withMessage('Valid babysitter ID is required'),
  body('date').isDate().withMessage('Valid date is required'),
  body('sessionType').isIn(['half-day', 'full-day']).withMessage('Valid session type is required'),
  body('numberOfChildren').isInt({ min: 1 }).withMessage('Number of children must be at least 1')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { babysitterId, date, sessionType, numberOfChildren } = req.body;

  try {
    // Get babysitter's hourly rate
    const [babysitter] = await pool.query(
      'SELECT hourlyRate FROM babysitters WHERE id = ?',
      [babysitterId]
    );

    if (babysitter.length === 0) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }

    // Calculate payment based on session type and number of children
    const baseRate = sessionType === 'half-day' ? HALF_DAY_RATE : FULL_DAY_RATE;
    const totalAmount = baseRate * numberOfChildren;

    // Create payment record
    const [result] = await pool.query(
      `INSERT INTO payments (
        babysitterId, amount, sessionType, numberOfChildren, date
      ) VALUES (?, ?, ?, ?, ?)`,
      [babysitterId, totalAmount, sessionType, numberOfChildren, date]
    );

    const [newPayment] = await pool.query(
      'SELECT * FROM payments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newPayment[0]);
  } catch (error) {
    console.error('Error calculating payment:', error);
    res.status(500).json({ message: 'Error calculating payment' });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    const [payments] = await pool.query(`
      SELECT p.*, b.firstName, b.lastName
      FROM payments p
      JOIN babysitters b ON p.babysitterId = b.id
      ORDER BY p.date DESC
    `);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

// Get payments for a specific babysitter
router.get('/babysitter/:id', async (req, res) => {
  try {
    const [payments] = await pool.query(`
      SELECT p.*, b.firstName, b.lastName
      FROM payments p
      JOIN babysitters b ON p.babysitterId = b.id
      WHERE p.babysitterId = ?
      ORDER BY p.date DESC
    `, [req.params.id]);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching babysitter payments:', error);
    res.status(500).json({ message: 'Error fetching babysitter payments' });
  }
});

// Update payment status
router.put('/:id/status', [
  body('status').isIn(['pending', 'paid', 'cancelled']).withMessage('Valid status is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [result] = await pool.query(
      'UPDATE payments SET status = ? WHERE id = ?',
      [req.body.status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const [updatedPayment] = await pool.query(
      'SELECT * FROM payments WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedPayment[0]);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status' });
  }
});

// Get payment summary for a period
router.get('/summary', [
  body('startDate').isDate().withMessage('Valid start date is required'),
  body('endDate').isDate().withMessage('Valid end date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { startDate, endDate } = req.body;

  try {
    const [summary] = await pool.query(`
      SELECT 
        COUNT(*) as totalPayments,
        SUM(amount) as totalAmount,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paidAmount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pendingAmount,
        SUM(CASE WHEN sessionType = 'half-day' THEN 1 ELSE 0 END) as halfDaySessions,
        SUM(CASE WHEN sessionType = 'full-day' THEN 1 ELSE 0 END) as fullDaySessions
      FROM payments
      WHERE date BETWEEN ? AND ?
    `, [startDate, endDate]);

    res.json(summary[0]);
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ message: 'Error fetching payment summary' });
  }
});

module.exports = router; 