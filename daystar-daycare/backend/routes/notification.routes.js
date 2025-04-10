const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { Child, Payment, Budget, Expense } = require('../models');
const { auth, isManager } = require('../middleware/auth.middleware');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send payment reminder to parent
router.post('/payment-reminder/:childId', [auth, isManager], async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.childId);

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      });
    }

    const subject = 'Payment Reminder - Daystar Daycare';
    const text = `Dear ${child.parentName},\n\nThis is a reminder that payment for ${child.firstName}'s daycare services is due. Please make the payment as soon as possible.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nDaystar Daycare Team`;
    const html = `
      <h2>Payment Reminder</h2>
      <p>Dear ${child.parentName},</p>
      <p>This is a reminder that payment for ${child.firstName}'s daycare services is due. Please make the payment as soon as possible.</p>
      <p>Thank you for your prompt attention to this matter.</p>
      <p>Best regards,<br>Daystar Daycare Team</p>
    `;

    const sent = await sendEmail(child.parentEmail, subject, text, html);

    if (!sent) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send payment reminder'
      });
    }

    res.json({
      status: 'success',
      message: 'Payment reminder sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending payment reminder',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Send overdue payment notification
router.post('/overdue-payment/:childId', [auth, isManager], async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.childId);

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      });
    }

    const subject = 'Overdue Payment Notice - Daystar Daycare';
    const text = `Dear ${child.parentName},\n\nThis notice is to inform you that payment for ${child.firstName}'s daycare services is overdue. Please make the payment immediately to avoid any service interruptions.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nDaystar Daycare Team`;
    const html = `
      <h2>Overdue Payment Notice</h2>
      <p>Dear ${child.parentName},</p>
      <p>This notice is to inform you that payment for ${child.firstName}'s daycare services is overdue. Please make the payment immediately to avoid any service interruptions.</p>
      <p>Thank you for your prompt attention to this matter.</p>
      <p>Best regards,<br>Daystar Daycare Team</p>
    `;

    const sent = await sendEmail(child.parentEmail, subject, text, html);

    if (!sent) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send overdue payment notice'
      });
    }

    res.json({
      status: 'success',
      message: 'Overdue payment notice sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending overdue payment notice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Send budget threshold alert
router.post('/budget-alert/:budgetId', [auth, isManager], async (req, res) => {
  try {
    const budget = await Budget.findByPk(req.params.budgetId);

    if (!budget) {
      return res.status(404).json({
        status: 'error',
        message: 'Budget not found'
      });
    }

    const isExceeded = await budget.isExceeded();

    if (!isExceeded) {
      return res.status(400).json({
        status: 'error',
        message: 'Budget threshold not exceeded'
      });
    }

    const subject = 'Budget Threshold Alert - Daystar Daycare';
    const text = `Budget Alert: The budget for ${budget.category} has exceeded ${budget.threshold}% of the allocated amount. Current spending: ${budget.amount}. Please review and take necessary action.\n\nBest regards,\nDaystar Daycare Team`;
    const html = `
      <h2>Budget Threshold Alert</h2>
      <p>Budget Alert: The budget for ${budget.category} has exceeded ${budget.threshold}% of the allocated amount.</p>
      <p>Current spending: ${budget.amount}</p>
      <p>Please review and take necessary action.</p>
      <p>Best regards,<br>Daystar Daycare Team</p>
    `;

    const sent = await sendEmail(process.env.MANAGER_EMAIL, subject, text, html);

    if (!sent) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send budget alert'
      });
    }

    res.json({
      status: 'success',
      message: 'Budget alert sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending budget alert',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Send daily financial summary
router.post('/daily-summary', [auth, isManager], async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's income
    const dailyIncome = await Payment.sum('amount', {
      where: {
        paymentDate: {
          [Op.gte]: today
        },
        paymentType: 'parent',
        paymentStatus: 'completed'
      }
    });

    // Get today's expenses
    const dailyExpenses = await Expense.sum('amount', {
      where: {
        date: {
          [Op.gte]: today
        },
        status: 'paid'
      }
    });

    const subject = 'Daily Financial Summary - Daystar Daycare';
    const text = `Daily Financial Summary for ${today.toLocaleDateString()}:\n\nIncome: ${dailyIncome || 0}\nExpenses: ${dailyExpenses || 0}\nNet: ${(dailyIncome || 0) - (dailyExpenses || 0)}\n\nBest regards,\nDaystar Daycare Team`;
    const html = `
      <h2>Daily Financial Summary</h2>
      <p>Date: ${today.toLocaleDateString()}</p>
      <table>
        <tr>
          <td><strong>Income:</strong></td>
          <td>${dailyIncome || 0}</td>
        </tr>
        <tr>
          <td><strong>Expenses:</strong></td>
          <td>${dailyExpenses || 0}</td>
        </tr>
        <tr>
          <td><strong>Net:</strong></td>
          <td>${(dailyIncome || 0) - (dailyExpenses || 0)}</td>
        </tr>
      </table>
      <p>Best regards,<br>Daystar Daycare Team</p>
    `;

    const sent = await sendEmail(process.env.MANAGER_EMAIL, subject, text, html);

    if (!sent) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send daily summary'
      });
    }

    res.json({
      status: 'success',
      message: 'Daily summary sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending daily summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 