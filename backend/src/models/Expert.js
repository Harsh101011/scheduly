const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },  // YYYY-MM-DD
    time: { type: String, required: true },  // HH:MM
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const ExpertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Business', 'Health', 'Finance', 'Legal', 'Marketing', 'Design', 'Education'],
    },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    hourlyRate: { type: Number, default: 0 },
    availableSlots: [SlotSchema],
  },
  { timestamps: true }
);

ExpertSchema.index({ category: 1 });
ExpertSchema.index({ name: 'text' });

module.exports = mongoose.model('Expert', ExpertSchema);
