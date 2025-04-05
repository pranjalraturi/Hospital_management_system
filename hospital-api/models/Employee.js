// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dob: {
    type: Date
  },
  hire_date: {
    type: Date
  },
  salary: {
    type: Number
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Employee', employeeSchema);
