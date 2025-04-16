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

// Create schedule and initial payment
router.post('/', [
  body('childId').isInt().withMessage('Valid child ID is required'),
  body('babysitterId').isInt().withMessage('Valid babysitter ID is required'),
  body('startDate').isDate().withMessage('Valid start date is required'),
  body('endDate').isDate().withMessage('Valid end date is required'),
  body('sessionType').isIn(['half-day', 'full-day']).withMessage('Valid session type is required'),
  body('paymentMethod').isIn(['cash', 'mobile_money', 'bank_transfer']).withMessage('Valid payment method is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { childId, babysitterId, startDate, endDate, sessionType, paymentMethod } = req.body;

  try {
    // Get babysitter's hourly rate
    const [babysitter] = await pool.query(
      'SELECT hourlyRate FROM babysitters WHERE id = ?',
      [babysitterId]
    );

    if (babysitter.length === 0) {
      return res.status(404).json({ message: 'Babysitter not found' });
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate total amount
    const dailyRate = sessionType === 'half-day' ? HALF_DAY_RATE : FULL_DAY_RATE;
    const totalAmount = dailyRate * days;

    // Create schedule
    const [scheduleResult] = await pool.query(
      `INSERT INTO schedules (
        childId, babysitterId, startDate, endDate, sessionType
      ) VALUES (?, ?, ?, ?, ?)`,
      [childId, babysitterId, startDate, endDate, sessionType]
    );

    // Create initial payment
    const [paymentResult] = await pool.query(
      `INSERT INTO payments (
        scheduleId, amount, paymentDate, paymentMethod, status
      ) VALUES (?, ?, ?, ?, ?)`,
      [scheduleResult.insertId, totalAmount, new Date(), paymentMethod, 'pending']
    );

    // Update child's payment status
    await pool.query(
      'UPDATE children SET paymentStatus = ?, lastPaymentDate = ? WHERE id = ?',
      ['pending', new Date(), childId]
    );

    // Get the created schedule with payment details
    const [newSchedule] = await pool.query(`
      SELECT s.*, p.amount, p.status as paymentStatus
      FROM schedules s
      JOIN payments p ON s.id = p.scheduleId
      WHERE s.id = ?
    `, [scheduleResult.insertId]);

    res.status(201).json(newSchedule[0]);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule' });
  }
});

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const [schedules] = await pool.query(`
      SELECT s.*, 
             c.firstName as childFirstName, c.lastName as childLastName,
             b.firstName as babysitterFirstName, b.lastName as babysitterLastName,
             p.amount, p.status as paymentStatus
      FROM schedules s
      JOIN children c ON s.childId = c.id
      JOIN babysitters b ON s.babysitterId = b.id
      JOIN payments p ON s.id = p.scheduleId
      ORDER BY s.startDate DESC
    `);
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules' });
  }
});

// Get schedules for a specific child
router.get('/child/:id', async (req, res) => {
  try {
    const [schedules] = await pool.query(`
      SELECT s.*, b.firstName as babysitterFirstName, b.lastName as babysitterLastName,
             p.amount, p.status as paymentStatus
      FROM schedules s
      JOIN babysitters b ON s.babysitterId = b.id
      JOIN payments p ON s.id = p.scheduleId
      WHERE s.childId = ?
      ORDER BY s.startDate DESC
    `, [req.params.id]);
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching child schedules:', error);
    res.status(500).json({ message: 'Error fetching child schedules' });
  }
});

// Get schedules for a specific babysitter
router.get('/babysitter/:id', async (req, res) => {
  try {
    const [schedules] = await pool.query(`
      SELECT s.*, c.firstName as childFirstName, c.lastName as childLastName,
             p.amount, p.status as paymentStatus
      FROM schedules s
      JOIN children c ON s.childId = c.id
      JOIN payments p ON s.id = p.scheduleId
      WHERE s.babysitterId = ?
      ORDER BY s.startDate DESC
    `, [req.params.id]);
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching babysitter schedules:', error);
    res.status(500).json({ message: 'Error fetching babysitter schedules' });
  }
});

// Update schedule status
router.put('/:id/status', [
  body('status').isIn(['active', 'completed', 'cancelled']).withMessage('Valid status is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [result] = await pool.query(
      'UPDATE schedules SET status = ? WHERE id = ?',
      [req.body.status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // If schedule is cancelled, update payment status
    if (req.body.status === 'cancelled') {
      await pool.query(
        'UPDATE payments SET status = ? WHERE scheduleId = ?',
        ['cancelled', req.params.id]
      );
    }

    const [updatedSchedule] = await pool.query(`
      SELECT s.*, p.amount, p.status as paymentStatus
      FROM schedules s
      JOIN payments p ON s.id = p.scheduleId
      WHERE s.id = ?
    `, [req.params.id]);

    res.json(updatedSchedule[0]);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Error updating schedule' });
  }
});

// Update payment status
router.put('/:id/payment', [
  body('status').isIn(['pending', 'paid', 'cancelled']).withMessage('Valid status is required'),
  body('transactionReference').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [result] = await pool.query(
      `UPDATE payments SET 
        status = ?,
        transactionReference = ?
      WHERE scheduleId = ?`,
      [req.body.status, req.body.transactionReference, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update child's payment status
    const [schedule] = await pool.query(
      'SELECT childId FROM schedules WHERE id = ?',
      [req.params.id]
    );

    if (schedule.length > 0) {
      await pool.query(
        'UPDATE children SET paymentStatus = ?, lastPaymentDate = ? WHERE id = ?',
        [req.body.status, new Date(), schedule[0].childId]
      );
    }

    const [updatedPayment] = await pool.query(`
      SELECT p.*, s.childId, s.babysitterId
      FROM payments p
      JOIN schedules s ON p.scheduleId = s.id
      WHERE p.scheduleId = ?
    `, [req.params.id]);

    res.json(updatedPayment[0]);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Error updating payment' });
  }
});

// Get payment summary
router.get('/payments/summary', async (req, res) => {
  try {
    const [summary] = await pool.query(`
      SELECT 
        COUNT(*) as totalPayments,
        SUM(amount) as totalAmount,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paidAmount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pendingAmount,
        SUM(CASE WHEN status = 'cancelled' THEN amount ELSE 0 END) as cancelledAmount
      FROM payments
    `);

    res.json(summary[0]);
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ message: 'Error fetching payment summary' });
  }
});

module.exports = router; 