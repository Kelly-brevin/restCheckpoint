// Import required modules
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });
// Load environment variables

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Import User model
const User = require("./models/user");

// ROUTE 1: GET - RETURN ALL USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

//  ROUTE 2: POST - ADD A NEW USER TO THE DATABASE
app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age }); // Create a new user instance
    await newUser.save(); // Save user to database
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: "Bad Request", error: err.message });
  }
});

//  ROUTE 3: PUT - EDIT A USER BY ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User Not Found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Update Failed", error: err.message });
  }
});

//  ROUTE 4: DELETE - REMOVE A USER BY ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User Not Found" });
    res.json({ message: "User Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion Failed", error: err.message });
  }
});
