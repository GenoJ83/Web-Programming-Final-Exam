const express = require ('express')
const router = express.Router()

const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.MARIADBPASSWORD,
  database: process.env.DB_NAME,
});

// Get all finances
router.get('/finances', async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM transactions');
      if (!res.headersSent) {
        res.json(results);
      }
    } catch (err) {
      console.error('Error in /finances:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      }
    }
  });
  
  
  // Create a new finance record
  router.post('/finances', async (req, res) => {
    const { type, amount, description, date, category, status } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO transactions (type, amount, description, date, category, status) VALUES (?, ?, ?, ?, ?, ?)',
        [type, amount, description, date, category, status]
      );
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Update an existing finance record
  router.put('/finances/:id', async (req, res) => {
    const { type, amount, description, date, category, status } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE transactions SET type = ?, amount = ?, description = ?, date = ?, category = ?, status = ? WHERE id = ?',
        [type, amount, description, date, category, status, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Finance record not found' });
      }
      res.json({ id: req.params.id, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Delete a finance record
  router.delete('/finances/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM transactions WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Finance record not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });





module.exports = router;