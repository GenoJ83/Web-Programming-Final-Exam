const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    parent: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        }
    },
    specialNeeds: {
        allergies: [String],
        medicalConditions: [String],
        dietaryRestrictions: [String],
        additionalNotes: String
    },
    enrollment: {
        startDate: {
            type: Date,
            required: true
        },
        sessionType: {
            type: String,
            enum: ['half-day', 'full-day'],
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        checkIn: Date,
        checkOut: Date,
        sessionType: {
            type: String,
            enum: ['half-day', 'full-day']
        },
        babysitter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Babysitter'
        }
    }],
    incidents: [{
        date: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            enum: ['health', 'behavior', 'injury', 'other'],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Babysitter'
        },
        status: {
            type: String,
            enum: ['open', 'resolved', 'pending'],
            default: 'open'
        }
    }]
}, {
    timestamps: true
});

// Virtual for calculating age
childSchema.virtual('age').get(function() {
    return Math.floor((new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

module.exports = mongoose.model('Child', childSchema); 