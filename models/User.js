const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "doctor", "patient"] },
});

module.exports = mongoose.model("User", UserSchema);
