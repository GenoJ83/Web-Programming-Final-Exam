const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Finance = require('../models/Finance');
const Notification = require('../models/Notification');

// Get financial summary
router.get('/summary', auth, authorize('manager'), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const finance = await Finance.findOne();

        if (!finance) {
            return res.status(404).json({ error: 'No financial records found' });
        }

        let transactions = finance.transactions;
        if (startDate && endDate) {
            transactions = transactions.filter(t => 
                t.date >= new Date(startDate) && 
                t.date <= new Date(endDate)
            );
        }

        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        res.json({
            income,
            expenses,
            netAmount: income - expenses,
            transactions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add transaction
router.post('/transactions', auth, authorize('manager'), async (req, res) => {
    try {
        const { type, category, amount, description, reference, referenceModel } = req.body;
        const finance = await Finance.findOne();

        if (!finance) {
            return res.status(404).json({ error: 'No financial records found' });
        }

        const transaction = {
            date: new Date(),
            type,
            category,
            amount,
            description,
            reference,
            referenceModel
        };

        finance.transactions.push(transaction);
        await finance.save();

        // Check budget adherence
        const budgetStatus = await finance.checkBudgetAdherence(category, 'monthly');
        if (budgetStatus && budgetStatus.percentageUsed > 80) {
            const notification = new Notification({
                recipient: req.user._id,
                recipientModel: 'User',
                type: 'budget_alert',
                title: 'Budget Alert',
                message: `Budget for ${category} is at ${budgetStatus.percentageUsed.toFixed(2)}%`,
                priority: budgetStatus.percentageUsed > 90 ? 'high' : 'medium',
                metadata: {
                    category,
                    percentageUsed: budgetStatus.percentageUsed,
                    remaining: budgetStatus.remaining
                }
            });

            await notification.save();
        }

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Set budget
router.post('/budgets', auth, authorize('manager'), async (req, res) => {
    try {
        const { category, amount, period, startDate, endDate } = req.body;
        const finance = await Finance.findOne();

        if (!finance) {
            return res.status(404).json({ error: 'No financial records found' });
        }

        const budget = {
            category,
            amount,
            period,
            startDate,
            endDate
        };

        finance.budgets.push(budget);
        await finance.save();

        res.status(201).json(budget);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get budget status
router.get('/budgets/status', auth, authorize('manager'), async (req, res) => {
    try {
        const { category, period } = req.query;
        const finance = await Finance.findOne();

        if (!finance) {
            return res.status(404).json({ error: 'No financial records found' });
        }

        const budgetStatus = await finance.checkBudgetAdherence(category, period);
        res.json(budgetStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get daily summary
router.get('/daily-summary', auth, authorize('manager'), async (req, res) => {
    try {
        const { date } = req.query;
        const finance = await Finance.findOne();

        if (!finance) {
            return res.status(404).json({ error: 'No financial records found' });
        }

        const summary = await finance.calculateDailySummary(date || new Date());
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get spending trends
router.get('/trends', auth, authorize('manager'), async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;
        const finance = await Finance.findOne();

        if (!finance) {
            return res.status(404).json({ error: 'No financial records found' });
        }

        let transactions = finance.transactions;
        if (startDate && endDate) {
            transactions = transactions.filter(t => 
                t.date >= new Date(startDate) && 
                t.date <= new Date(endDate)
            );
        }

        if (category) {
            transactions = transactions.filter(t => t.category === category);
        }

        // Group transactions by date
        const trends = transactions.reduce((acc, t) => {
            const date = t.date.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = {
                    income: 0,
                    expenses: 0,
                    netAmount: 0
                };
            }
            if (t.type === 'income') {
                acc[date].income += t.amount;
            } else {
                acc[date].expenses += t.amount;
            }
            acc[date].netAmount = acc[date].income - acc[date].expenses;
            return acc;
        }, {});

        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 