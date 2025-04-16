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

// Create incident and notify parents
router.post('/', [
  body('childId').isInt().withMessage('Valid child ID is required'),
  body('babysitterId').isInt().withMessage('Valid babysitter ID is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('severity').isIn(['low', 'medium', 'high']).withMessage('Valid severity is required'),
  body('actionTaken').optional().isString(),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { childId, babysitterId, description, severity, actionTaken, date } = req.body;

  try {
    // Get child and parent information
    const [childInfo] = await pool.query(`
      SELECT c.*, u.id as parentUserId 
      FROM children c
      JOIN users u ON c.parentId = u.id
      WHERE c.id = ?
    `, [childId]);

    if (childInfo.length === 0) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Create incident
    const [result] = await pool.query(
      `INSERT INTO incidents (
        childId, babysitterId, description, severity, actionTaken, date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [childId, babysitterId, description, severity, actionTaken, date, 'open']
    );

    // Create notification for parent
    const notificationTitle = `Incident Report - ${severity} severity`;
    const notificationMessage = `An incident has been reported for ${childInfo[0].firstName} ${childInfo[0].lastName}. Description: ${description}`;

    await pool.query(
      `INSERT INTO notifications (
        userId, type, title, message, relatedId, isRead
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [childInfo[0].parentUserId, 'incident', notificationTitle, notificationMessage, result.insertId, false]
    );

    const [newIncident] = await pool.query(
      'SELECT * FROM incidents WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newIncident[0]);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ message: 'Error creating incident' });
  }
});

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const [incidents] = await pool.query(`
      SELECT i.*, 
             c.firstName as childFirstName, c.lastName as childLastName,
             b.firstName as babysitterFirstName, b.lastName as babysitterLastName
      FROM incidents i
      JOIN children c ON i.childId = c.id
      JOIN babysitters b ON i.babysitterId = b.id
      ORDER BY i.date DESC
    `);
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ message: 'Error fetching incidents' });
  }
});

// Get incidents for a specific child
router.get('/child/:id', async (req, res) => {
  try {
    const [incidents] = await pool.query(`
      SELECT i.*, b.firstName as babysitterFirstName, b.lastName as babysitterLastName
      FROM incidents i
      JOIN babysitters b ON i.babysitterId = b.id
      WHERE i.childId = ?
      ORDER BY i.date DESC
    `, [req.params.id]);
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching child incidents:', error);
    res.status(500).json({ message: 'Error fetching child incidents' });
  }
});

// Update incident status
router.put('/:id/status', [
  body('status').isIn(['open', 'resolved']).withMessage('Valid status is required'),
  body('actionTaken').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status, actionTaken } = req.body;

  try {
    // Get incident and child information
    const [incidentInfo] = await pool.query(`
      SELECT i.*, c.parentId, u.id as parentUserId
      FROM incidents i
      JOIN children c ON i.childId = c.id
      JOIN users u ON c.parentId = u.id
      WHERE i.id = ?
    `, [req.params.id]);

    if (incidentInfo.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Update incident
    const [result] = await pool.query(
      `UPDATE incidents SET
        status = ?,
        actionTaken = ?
      WHERE id = ?`,
      [status, actionTaken, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Create notification for status update
    const notificationTitle = `Incident Update - ${status}`;
    const notificationMessage = `The incident has been marked as ${status}. Action taken: ${actionTaken || 'No action specified'}`;

    await pool.query(
      `INSERT INTO notifications (
        userId, type, title, message, relatedId
      ) VALUES (?, ?, ?, ?, ?)`,
      [incidentInfo[0].parentUserId, 'incident', notificationTitle, notificationMessage, req.params.id]
    );

    const [updatedIncident] = await pool.query(
      'SELECT * FROM incidents WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedIncident[0]);
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ message: 'Error updating incident' });
  }
});

// Get notifications for a user
router.get('/notifications/:userId', async (req, res) => {
  try {
    const [notifications] = await pool.query(`
      SELECT * FROM notifications
      WHERE userId = ?
      ORDER BY createdAt DESC
    `, [req.params.userId]);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE notifications SET isRead = TRUE WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

module.exports = router; 