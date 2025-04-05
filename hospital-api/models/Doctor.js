const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  empId: {
    type: Number,
    required: true,
    ref: 'Employee'
  },
  charges: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);