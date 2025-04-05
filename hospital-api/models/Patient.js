const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true,
    ref: 'User'
  },
  wardId: {
    type: Number
  },
  doctorId: {
    type: Number,
    required: true,
    ref: 'Doctor'
  },
  dateOfAdm: {
    type: Date,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  prescription: {
    type: String
  },
  bedAllocated: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial'],
    default: 'pending'
  },
  patientProblem: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);