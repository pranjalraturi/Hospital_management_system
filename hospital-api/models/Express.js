const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  dob: {
    type: Date,
    required: true
  },
  hireDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);