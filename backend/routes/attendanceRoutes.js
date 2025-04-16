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

// Record attendance
router.post('/', [
  body('childId').isInt().withMessage('Valid child ID is required'),
  body('babysitterId').isInt().withMessage('Valid babysitter ID is required'),
  body('date').isDate().withMessage('Valid date is required'),
  body('sessionType').isIn(['half-day', 'full-day']).withMessage('Valid session type is required'),
  body('status').isIn(['present', 'absent']).withMessage('Valid status is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { childId, babysitterId, date, sessionType, status, checkInTime, checkOutTime } = req.body;

  try {
    // Check if attendance already recorded for this child on this date
    const [existingAttendance] = await pool.query(
      'SELECT * FROM attendance WHERE childId = ? AND date = ? AND sessionType = ?',
      [childId, date, sessionType]
    );

    if (existingAttendance.length > 0) {
      return res.status(400).json({ message: 'Attendance already recorded for this session' });
    }

    // Record attendance
    const [result] = await pool.query(
      `INSERT INTO attendance (
        childId, babysitterId, date, sessionType, status, checkInTime, checkOutTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [childId, babysitterId, date, sessionType, status, checkInTime, checkOutTime]
    );

    // Update child's attendance status
    await pool.query(
      'UPDATE children SET attendanceStatus = ? WHERE id = ?',
      [status, childId]
    );

    const [newAttendance] = await pool.query(
      'SELECT * FROM attendance WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newAttendance[0]);
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ message: 'Error recording attendance' });
  }
});

// Get attendance for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const [attendance] = await pool.query(`
      SELECT a.*, c.firstName as childFirstName, c.lastName as childLastName,
             b.firstName as babysitterFirstName, b.lastName as babysitterLastName
      FROM attendance a
      JOIN children c ON a.childId = c.id
      JOIN babysitters b ON a.babysitterId = b.id
      WHERE a.date = ?
      ORDER BY a.checkInTime
    `, [req.params.date]);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

// Get attendance for a specific child
router.get('/child/:id', async (req, res) => {
  try {
    const [attendance] = await pool.query(`
      SELECT a.*, b.firstName as babysitterFirstName, b.lastName as babysitterLastName
      FROM attendance a
      JOIN babysitters b ON a.babysitterId = b.id
      WHERE a.childId = ?
      ORDER BY a.date DESC
    `, [req.params.id]);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching child attendance:', error);
    res.status(500).json({ message: 'Error fetching child attendance' });
  }
});

// Get attendance for a specific babysitter
router.get('/babysitter/:id', async (req, res) => {
  try {
    const [attendance] = await pool.query(`
      SELECT a.*, c.firstName as childFirstName, c.lastName as childLastName
      FROM attendance a
      JOIN children c ON a.childId = c.id
      WHERE a.babysitterId = ?
      ORDER BY a.date DESC
    `, [req.params.id]);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching babysitter attendance:', error);
    res.status(500).json({ message: 'Error fetching babysitter attendance' });
  }
});

// Update attendance
router.put('/:id', [
  body('status').isIn(['present', 'absent']).withMessage('Valid status is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status, checkInTime, checkOutTime } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE attendance SET
        status = ?,
        checkInTime = ?,
        checkOutTime = ?
      WHERE id = ?`,
      [status, checkInTime, checkOutTime, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Update child's attendance status
    const [attendance] = await pool.query(
      'SELECT childId FROM attendance WHERE id = ?',
      [req.params.id]
    );

    if (attendance.length > 0) {
      await pool.query(
        'UPDATE children SET attendanceStatus = ? WHERE id = ?',
        [status, attendance[0].childId]
      );
    }

    const [updatedAttendance] = await pool.query(
      'SELECT * FROM attendance WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedAttendance[0]);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance' });
  }
});

// Get attendance summary for a period
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
        COUNT(*) as totalSessions,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absentCount,
        SUM(CASE WHEN sessionType = 'half-day' THEN 1 ELSE 0 END) as halfDaySessions,
        SUM(CASE WHEN sessionType = 'full-day' THEN 1 ELSE 0 END) as fullDaySessions
      FROM attendance
      WHERE date BETWEEN ? AND ?
    `, [startDate, endDate]);

    res.json(summary[0]);
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
});

module.exports = router; 