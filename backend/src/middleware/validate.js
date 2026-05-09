const { body, validationResult } = require('express-validator');

exports.validateBooking = [
  body('expertId').notEmpty().withMessage('Expert ID is required'),
  body('userName').notEmpty().trim().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email address is required'),
  body('phone')
    .matches(/^\+?[\d\s\-().]{7,20}$/)
    .withMessage('A valid phone number is required'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  body('timeSlot')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Time slot must be in HH:MM format'),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
