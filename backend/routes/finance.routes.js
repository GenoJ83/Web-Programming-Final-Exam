const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Payment, Expense, Budget, Child, Babysitter } = require('../models');
const { auth, isManager } = require('../middleware/auth.middleware');

// Validation middleware
const validatePayment = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
  body('paymentType').isIn(['parent', 'babysitter']).withMessage('Invalid payment type'),
  body('paymentMethod').isIn(['cash', 'mobile_money', 'bank_transfer']).withMessage('Invalid payment method'),
  body('sessionType').isIn(['half-day', 'full-day']).withMessage('Invalid session type')
];

const validateExpense = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
  body('category').isIn(['salaries', 'toys', 'maintenance', 'utilities', 'supplies', 'other']).withMessage('Invalid category'),
  body('paymentMethod').isIn(['cash', 'mobile_money', 'bank_transfer']).withMessage('Invalid payment method'),
  body('description').trim().notEmpty().withMessage('Description is required')
];

const validateBudget = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
  body('category').isIn(['salaries', 'toys', 'maintenance', 'utilities', 'supplies', 'other']).withMessage('Invalid category'),
  body('period').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid period'),
  body('startDate').isDate().withMessage('Valid start date is required'),
  body('endDate').isDate().withMessage('Valid end date is required')
];

// Payment Routes
// Record new payment
router.post('/payments', [auth, isManager, validatePayment], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const paymentData = req.body;

    // Validate child or babysitter exists
    if (paymentData.paymentType === 'parent') {
      const child = await Child.findByPk(paymentData.childId);
      if (!child) {
        return res.status(400).json({
          status: 'error',
          message: 'Child not found'
        });
      }
    } else {
      const babysitter = await Babysitter.findByPk(paymentData.babysitterId);
      if (!babysitter) {
        return res.status(400).json({
          status: 'error',
          message: 'Babysitter not found'
        });
      }
    }

    const payment = await Payment.create({
      ...paymentData,
      paymentDate: new Date()
    });

    res.status(201).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error recording payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all payments
router.get('/payments', [auth, isManager], async (req, res) => {
  try {
    const { startDate, endDate, paymentType } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.paymentDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (paymentType) {
      where.paymentType = paymentType;
    }

    const payments = await Payment.findAll({
      where,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Babysitter,
          as: 'babysitter',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['paymentDate', 'DESC']]
    });

    res.json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Expense Routes
// Record new expense
router.post('/expenses', [auth, isManager, validateExpense], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = await Expense.create({
      ...req.body,
      approvedBy: req.user.id,
      approvedAt: new Date()
    });

    res.status(201).json({
      status: 'success',
      data: { expense }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error recording expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all expenses
router.get('/expenses', [auth, isManager], async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (category) {
      where.category = category;
    }

    const expenses = await Expense.findAll({
      where,
      include: [
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: { expenses }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching expenses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Budget Routes
// Create new budget
router.post('/budgets', [auth, isManager, validateBudget], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const budget = await Budget.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: { budget }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating budget',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all budgets
router.get('/budgets', [auth, isManager], async (req, res) => {
  try {
    const { category, period } = req.query;
    const where = {};

    if (category) {
      where.category = category;
    }

    if (period) {
      where.period = period;
    }

    const budgets = await Budget.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['startDate', 'DESC']]
    });

    res.json({
      status: 'success',
      data: { budgets }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching budgets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Financial Reports
// Get financial summary
router.get('/summary', [auth, isManager], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Get total income
    const totalIncome = await Payment.sum('amount', {
      where: {
        ...where,
        paymentType: 'parent',
        paymentStatus: 'completed'
      }
    });

    // Get total expenses
    const totalExpenses = await Expense.sum('amount', {
      where: {
        ...where,
        status: 'paid'
      }
    });

    // Get expenses by category
    const expensesByCategory = await Expense.findAll({
      where: {
        ...where,
        status: 'paid'
      },
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['category']
    });

    res.json({
      status: 'success',
      data: {
        totalIncome: totalIncome || 0,
        totalExpenses: totalExpenses || 0,
        netIncome: (totalIncome || 0) - (totalExpenses || 0),
        expensesByCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error generating financial summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 