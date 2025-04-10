const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    transactions: [{
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true
        },
        category: {
            type: String,
            enum: [
                'tuition',
                'babysitter_salary',
                'toys_materials',
                'maintenance',
                'utilities',
                'other'
            ],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: String,
        reference: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'transactions.referenceModel'
        },
        referenceModel: {
            type: String,
            enum: ['Child', 'Babysitter']
        }
    }],
    budgets: [{
        category: {
            type: String,
            enum: [
                'babysitter_salary',
                'toys_materials',
                'maintenance',
                'utilities',
                'other'
            ],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        period: {
            type: String,
            enum: ['weekly', 'monthly', 'yearly'],
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    }],
    dailySummaries: [{
        date: {
            type: Date,
            required: true
        },
        income: {
            type: Number,
            default: 0
        },
        expenses: {
            type: Number,
            default: 0
        },
        netAmount: {
            type: Number,
            default: 0
        },
        transactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        }]
    }]
}, {
    timestamps: true
});

// Method to calculate daily summary
financeSchema.methods.calculateDailySummary = async function(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyTransactions = this.transactions.filter(t => 
        t.date >= startOfDay && t.date <= endOfDay
    );

    const income = dailyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = dailyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        date,
        income,
        expenses,
        netAmount: income - expenses,
        transactions: dailyTransactions
    };
};

// Method to check budget adherence
financeSchema.methods.checkBudgetAdherence = async function(category, period) {
    const currentBudget = this.budgets.find(b => 
        b.category === category && 
        b.period === period &&
        new Date() >= b.startDate &&
        new Date() <= b.endDate
    );

    if (!currentBudget) return null;

    const transactions = this.transactions.filter(t => 
        t.category === category &&
        t.date >= currentBudget.startDate &&
        t.date <= currentBudget.endDate
    );

    const totalSpent = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        budget: currentBudget.amount,
        spent: totalSpent,
        remaining: currentBudget.amount - totalSpent,
        percentageUsed: (totalSpent / currentBudget.amount) * 100
    };
};

module.exports = mongoose.model('Finance', financeSchema); 