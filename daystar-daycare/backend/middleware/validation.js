const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation rules
const userValidationRules = () => {
  return [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['admin', 'staff', 'parent']).withMessage('Invalid role'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  ];
};

// Child validation rules
const childValidationRules = () => {
  return [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
    body('parentId').isMongoId().withMessage('Invalid parent ID'),
    body('enrollmentDate').isISO8601().withMessage('Invalid enrollment date'),
    body('medicalInfo').optional().isObject().withMessage('Medical info must be an object'),
    body('emergencyContact').optional().isObject().withMessage('Emergency contact must be an object'),
  ];
};

// Event validation rules
const eventValidationRules = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('endDate').isISO8601().withMessage('Invalid end date'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  ];
};

// Payment validation rules
const paymentValidationRules = () => {
  return [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
    body('parentId').isMongoId().withMessage('Invalid parent ID'),
    body('childId').isMongoId().withMessage('Invalid child ID'),
    body('paymentDate').isISO8601().withMessage('Invalid payment date'),
    body('paymentMethod').isIn(['cash', 'card', 'bank_transfer']).withMessage('Invalid payment method'),
    body('status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid payment status'),
  ];
};

// Notification validation rules
const notificationValidationRules = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('type').isIn(['info', 'warning', 'error', 'success']).withMessage('Invalid notification type'),
  ];
};

module.exports = {
  validate,
  userValidationRules,
  childValidationRules,
  eventValidationRules,
  paymentValidationRules,
  notificationValidationRules,
}; 