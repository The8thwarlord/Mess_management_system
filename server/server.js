const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173", "https://*.loca.lt"], // Allow localhost and loca.lt subdomains
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  credentials: true, // Allow cookies and credentials
}));

app.options("*", cors({
  origin: ["http://localhost:5173", "https://*.loca.lt"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Middleware
app.use(express.json());

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

// Routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

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

app.post("/mark-attendance", async (req, res) => {
  const { userId } = req.body;
  const date = new Date().toISOString().split("T")[0];

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if attendance for the current date already exists
    const existingAttendance = user.attendance.find((record) => record.date === date);
    if (existingAttendance) {
      // Overwrite the existing attendance record
      existingAttendance.status = "Present";
    } else {
      // Add a new attendance record
      user.attendance.push({ date, status: "Present" });
    }

    await user.save();

    res.status(200).json({ message: "Attendance marked successfully", attendance: user.attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ user: { _id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});