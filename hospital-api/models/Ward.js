const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['general', 'private', 'icu', 'emergency']
  },
  charges: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  maxCap: {
    type: Number,
    required: true
  },
  currentOccupancy: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Ward', wardSchema);