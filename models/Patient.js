const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    dateOfAdmission: Date,
    bloodGroup: String,
    prescription: String,
    paymentStatus: String,
});

module.exports = mongoose.model("Patient", PatientSchema);
