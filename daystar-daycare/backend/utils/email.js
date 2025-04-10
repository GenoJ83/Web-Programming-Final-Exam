const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const templates = {
  welcome: (user) => ({
    subject: 'Welcome to Daystar Daycare',
    html: `
      <h1>Welcome to Daystar Daycare!</h1>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for registering with Daystar Daycare. We're excited to have you on board!</p>
      <p>You can now log in to your account and start managing your children's information.</p>
      <p>Best regards,<br>The Daystar Team</p>
    `
  }),
  
  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>Dear ${user.firstName},</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <p><a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The Daystar Team</p>
    `
  }),
  
  paymentReminder: (user, payment) => ({
    subject: 'Payment Reminder',
    html: `
      <h1>Payment Reminder</h1>
      <p>Dear ${user.firstName},</p>
      <p>This is a reminder that your payment of $${payment.amount} is due on ${new Date(payment.dueDate).toLocaleDateString()}.</p>
      <p>Please log in to your account to make the payment.</p>
      <p>Best regards,<br>The Daystar Team</p>
    `
  }),
  
  eventInvitation: (user, event) => ({
    subject: 'Event Invitation',
    html: `
      <h1>Event Invitation</h1>
      <p>Dear ${user.firstName},</p>
      <p>You're invited to ${event.title}!</p>
      <p>Date: ${new Date(event.startDate).toLocaleDateString()}</p>
      <p>Time: ${new Date(event.startDate).toLocaleTimeString()}</p>
      <p>Location: ${event.location}</p>
      <p>${event.description}</p>
      <p>Please log in to your account to RSVP.</p>
      <p>Best regards,<br>The Daystar Team</p>
    `
  }),
  
  notification: (user, notification) => ({
    subject: notification.title,
    html: `
      <h1>${notification.title}</h1>
      <p>Dear ${user.firstName},</p>
      <p>${notification.message}</p>
      <p>Best regards,<br>The Daystar Team</p>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const { subject, html } = templates[template](data);
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
}; 