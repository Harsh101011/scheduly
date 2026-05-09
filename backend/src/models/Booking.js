const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    expertName: { type: String },
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },      // YYYY-MM-DD
    timeSlot: { type: String, required: true },  // HH:MM
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// ✅ Critical: unique compound index to prevent double booking at DB level
// Even under race conditions, MongoDB guarantees only one insert wins.
BookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);
