const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus, getBookingsByEmail } = require('../controllers/bookingController');
const { validateBooking, handleValidationErrors } = require('../middleware/validate');

router.post('/', validateBooking, handleValidationErrors, createBooking);
router.patch('/:id/status', updateBookingStatus);
router.get('/', getBookingsByEmail);

module.exports = router;
