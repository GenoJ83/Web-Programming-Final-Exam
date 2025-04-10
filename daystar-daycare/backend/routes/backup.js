const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createBackup,
  restoreBackup,
  listBackups,
  deleteBackup
} = require('../utils/backup');

// Create a new backup
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const backup = await createBackup();
    res.json(backup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all backups
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const backups = await listBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restore from backup
router.post('/:id/restore', auth, authorize('admin'), async (req, res) => {
  try {
    const result = await restoreBackup(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete backup
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const result = await deleteBackup(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 