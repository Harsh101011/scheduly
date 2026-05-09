const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, email, phone, date, timeSlot, notes } = req.body;

    // Verify expert exists and slot is valid
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    const slot = expert.availableSlots.find((s) => s.date === date && s.time === timeSlot);
    if (!slot) {
      return res.status(400).json({ success: false, message: 'Selected time slot does not exist' });
    }
    if (slot.isBooked) {
      return res.status(409).json({
        success: false,
        message: 'This slot has already been booked. Please choose another time.',
      });
    }

    // Atomic insert — unique index prevents race condition duplicate
    const booking = await Booking.create({
      expertId,
      expertName: expert.name,
      userName,
      email: email.toLowerCase().trim(),
      phone,
      date,
      timeSlot,
      notes: notes || '',
    });

    // Mark slot as booked in Expert document
    await Expert.updateOne(
      { _id: expertId, 'availableSlots.date': date, 'availableSlots.time': timeSlot },
      { $set: { 'availableSlots.$.isBooked': true } }
    );

    // Emit real-time event to all clients viewing this expert
    const io = req.app.get('io');
    if (io) {
      io.to(expertId.toString()).emit('slot_booked', {
        expertId: expertId.toString(),
        date,
        timeSlot,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: booking,
    });
  } catch (err) {
    // MongoDB duplicate key — race condition caught at DB level
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This slot has already been booked. Please choose another time.',
      });
    }
    next(err);
  }
};

// PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(', ')}`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('expertId', 'name category avatar');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings?email=user@example.com
exports.getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required' });
    }

    const bookings = await Booking.find({ email: email.toLowerCase().trim() })
      .populate('expertId', 'name category avatar rating')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings, count: bookings.length });
  } catch (err) {
    next(err);
  }
};
