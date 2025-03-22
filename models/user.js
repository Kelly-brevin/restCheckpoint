const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
});

// Export the User model
module.exports = mongoose.model("User", userSchema);
