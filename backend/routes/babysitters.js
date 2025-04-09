const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Babysitter = require('../models/Babysitter');
const Finance = require('../models/Finance');

// Register new babysitter (Manager only)
router.post('/', auth, authorize('manager'), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            nin,
            dateOfBirth,
            nextOfKin
        } = req.body;

        // Check if babysitter already exists
        const existingBabysitter = await Babysitter.findOne({ nin });
        if (existingBabysitter) {
            return res.status(400).json({ error: 'NIN already registered' });
        }

        const babysitter = new Babysitter({
            firstName,
            lastName,
            email,
            phoneNumber,
            nin,
            dateOfBirth,
            nextOfKin
        });

        await babysitter.save();
        res.status(201).json(babysitter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all babysitters
router.get('/', auth, async (req, res) => {
    try {
        const babysitters = await Babysitter.find();
        res.json(babysitters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get babysitter by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const babysitter = await Babysitter.findById(req.params.id);
        if (!babysitter) {
            return res.status(404).json({ error: 'Babysitter not found' });
        }
        res.json(babysitter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update babysitter schedule
router.patch('/:id/schedule', auth, authorize('manager'), async (req, res) => {
    try {
        const { date, shift, children } = req.body;
        const babysitter = await Babysitter.findById(req.params.id);

        if (!babysitter) {
            return res.status(404).json({ error: 'Babysitter not found' });
        }

        // Add or update schedule
        const scheduleIndex = babysitter.schedule.findIndex(
            s => s.date.toDateString() === new Date(date).toDateString()
        );

        if (scheduleIndex > -1) {
            babysitter.schedule[scheduleIndex] = { date, shift, children };
        } else {
            babysitter.schedule.push({ date, shift, children });
        }

        await babysitter.save();
        res.json(babysitter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Calculate babysitter payment
router.post('/:id/calculate-payment', auth, authorize('manager'), async (req, res) => {
    try {
        const { date, shiftType } = req.body;
        const babysitter = await Babysitter.findById(req.params.id);

        if (!babysitter) {
            return res.status(404).json({ error: 'Babysitter not found' });
        }

        // Find schedule for the date
        const schedule = babysitter.schedule.find(
            s => s.date.toDateString() === new Date(date).toDateString()
        );

        if (!schedule) {
            return res.status(400).json({ error: 'No schedule found for this date' });
        }

        // Calculate payment
        const childrenCount = schedule.children.length;
        const ratePerChild = shiftType === 'half-day' ? 2000 : 5000;
        const totalAmount = childrenCount * ratePerChild;

        // Create payment record
        const payment = {
            date: new Date(date),
            amount: totalAmount,
            childrenCount,
            shiftType,
            status: 'pending'
        };

        babysitter.paymentHistory.push(payment);
        await babysitter.save();

        // Update finance records
        const finance = await Finance.findOne();
        if (finance) {
            finance.transactions.push({
                date: new Date(date),
                type: 'expense',
                category: 'babysitter_salary',
                amount: totalAmount,
                description: `Payment to ${babysitter.firstName} ${babysitter.lastName}`,
                reference: babysitter._id,
                referenceModel: 'Babysitter'
            });
            await finance.save();
        }

        res.json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Clear babysitter payment
router.patch('/:id/clear-payment/:paymentId', auth, authorize('manager'), async (req, res) => {
    try {
        const babysitter = await Babysitter.findById(req.params.id);
        if (!babysitter) {
            return res.status(404).json({ error: 'Babysitter not found' });
        }

        const payment = babysitter.paymentHistory.id(req.params.paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment record not found' });
        }

        payment.status = 'cleared';
        await babysitter.save();

        res.json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 