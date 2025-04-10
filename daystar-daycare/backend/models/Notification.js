const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'recipientModel',
        required: true
    },
    recipientModel: {
        type: String,
        enum: ['User', 'Child'],
        required: true
    },
    type: {
        type: String,
        enum: [
            'child_check_in',
            'child_check_out',
            'incident_report',
            'payment_reminder',
            'payment_overdue',
            'budget_alert',
            'schedule_update'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
        default: 'pending'
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    sentAt: Date,
    readAt: Date
}, {
    timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ createdAt: 1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
};

// Method to mark notification as sent
notificationSchema.methods.markAsSent = async function() {
    this.status = 'sent';
    this.sentAt = new Date();
    return this.save();
};

// Static method to get unread notifications
notificationSchema.statics.getUnreadNotifications = function(recipientId) {
    return this.find({
        recipient: recipientId,
        status: { $in: ['pending', 'sent', 'delivered'] }
    }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Notification', notificationSchema); 