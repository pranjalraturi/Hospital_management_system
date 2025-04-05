const mongoose = require('mongoose');

const medicineAssignedSchema = new mongoose.Schema({
  patId: {
    type: Number,
    required: true,
    ref: 'Patient'
  },
  medicineId: {
    type: Number,
    required: true,
    ref: 'Medicine'
  },
  prescription: {
    type: String,
    required: true
  },
  medicineQty: {
    type: Number,
    required: true,
    min: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('MedicineAssigned', medicineAssignedSchema);