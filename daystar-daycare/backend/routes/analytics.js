const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Child = require('../models/Child');
const Event = require('../models/Event');
const Payment = require('../models/Payment');

// Get enrollment statistics
router.get('/enrollment', auth, authorize('admin'), async (req, res) => {
  try {
    const totalChildren = await Child.countDocuments();
    const childrenByAge = await Child.aggregate([
      {
        $group: {
          _id: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), '$dateOfBirth'] },
                31536000000 // milliseconds in a year
              ]
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const childrenByGender = await Child.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalChildren,
      childrenByAge,
      childrenByGender
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get financial statistics
router.get('/financial', auth, authorize('admin'), async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const revenueByMonth = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const pendingPayments = await Payment.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueByMonth,
      pendingPayments: pendingPayments[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event statistics
router.get('/events', auth, authorize('admin'), async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      startDate: { $gte: new Date() }
    });

    const eventsByType = await Event.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          averageAttendance: { $avg: '$attendance' }
        }
      }
    ]);

    res.json({
      totalEvents,
      upcomingEvents,
      eventsByType
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user statistics
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalUsers,
      usersByRole,
      activeUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance statistics
router.get('/attendance', auth, authorize('admin'), async (req, res) => {
  try {
    const attendanceByMonth = await Child.aggregate([
      {
        $unwind: '$attendance'
      },
      {
        $group: {
          _id: {
            year: { $year: '$attendance.date' },
            month: { $month: '$attendance.date' }
          },
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: ['$attendance.status', 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalDays: 1,
          presentDays: 1,
          attendanceRate: {
            $multiply: [
              { $divide: ['$presentDays', '$totalDays'] },
              100
            ]
          }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json({ attendanceByMonth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 