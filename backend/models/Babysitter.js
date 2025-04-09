const mongoose = require('mongoose');

const babysitterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    nin: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    nextOfKin: {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        }
    },
    schedule: [{
        date: Date,
        shift: {
            type: String,
            enum: ['half-day', 'full-day']
        },
        children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Child'
        }]
    }],
    paymentHistory: [{
        date: Date,
        amount: Number,
        childrenCount: Number,
        shiftType: {
            type: String,
            enum: ['half-day', 'full-day']
        },
        status: {
            type: String,
            enum: ['pending', 'cleared'],
            default: 'pending'
        }
    }]
}, {
    timestamps: true
});

// Virtual for calculating age
babysitterSchema.virtual('age').get(function() {
    return Math.floor((new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

// Pre-save middleware to validate age
babysitterSchema.pre('save', function(next) {
    if (this.age < 21 || this.age > 35) {
        next(new Error('Babysitter must be between 21 and 35 years old'));
    }
    next();
});

module.exports = mongoose.model('Babysitter', babysitterSchema); 