const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mess_management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  attendance: [
    {
      date: String,
      status: String, // e.g., "Present" or "Absent"
    },
  ],
  payments: [
    {
      date: String,
      amount: Number,
      remaining: Number,
      status: String,
      nextPaymentDate: String,
    },
  ],
});
const User = mongoose.model("User", UserSchema);

// Fetch user-specific data
app.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update attendance for a user
app.post("/user/:userId/attendance", async (req, res) => {
  const { date, status } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.attendance.push({ date, status });
    await user.save();
    res.status(200).json({ message: "Attendance updated", attendance: user.attendance });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update payment for a user
app.post("/user/:userId/payments", async (req, res) => {
  const { date, amount, remaining, status, nextPaymentDate } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.payments.push({ date, amount, remaining, status, nextPaymentDate });
    await user.save();
    res.status(200).json({ message: "Payment updated", payments: user.payments });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint for user registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});