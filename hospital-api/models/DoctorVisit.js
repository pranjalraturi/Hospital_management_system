const mongoose = require('mongoose');

const doctorVisitSchema = new mongoose.Schema({
  patId: {
    type: Number,
    required: true,
    ref: 'Patient'
  },
  doctorId: {
    type: Number,
    required: true,
    ref: 'Doctor'
  },
  visits: {
    type: Number,
    default: 1
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('DoctorVisit', doctorVisitSchema);