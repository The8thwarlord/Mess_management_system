const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:5173", // Local development
    "https://your-backend-subdomain.loca.lt", // Backend localtunnel URL
    "https://frontend.loca.lt" // Frontend localtunnel URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.options("*", cors({
  origin: [
    "http://localhost:5173",
    "https://your-backend-subdomain.loca.lt",
    "https://frontend.loca.lt"
  ],
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
  registrationDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
  rollNo: String,
  mobileNo: String,
  roomNo: String,
  yearOfStudy: String,
  branch: String,
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

app.put("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    // Prevent email and _id changes for security
    delete updateData._id;
    delete updateData.email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // THIS IS IMPORTANT:
    return res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// server.js (excerpt)
app.post("/mark-attendance", async (req, res) => {
  const { userId } = req.body;
  const today = new Date().toISOString().split("T")[0];

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Get all attendance dates
    const markedDates = user.attendance.map(a => a.date);

    // Use registrationDate as the earliest possible date
    const registrationDate = user.registrationDate || today;

    // Find the last date attendance was marked, or registrationDate if none
    let lastMarkedDate = user.attendance.length
      ? user.attendance.map(a => a.date).sort().slice(-1)[0]
      : registrationDate;

    // Only fill absents for days after registrationDate
    let current = new Date(lastMarkedDate);
    const end = new Date(today);
    current.setDate(current.getDate() + 1); // Start from next day

    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      // Only add absents if dateStr >= registrationDate
      if (
        !markedDates.includes(dateStr) &&
        new Date(dateStr) >= new Date(registrationDate)
      ) {
        user.attendance.push({ date: dateStr, status: "Absent" });
      }
      current.setDate(current.getDate() + 1);
    }

    // Mark today as Present
    const todayRecord = user.attendance.find(a => a.date === today);
    if (todayRecord) {
      todayRecord.status = "Present";
    } else {
      user.attendance.push({ date: today, status: "Present" });
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

    const registrationDate = new Date().toISOString().split("T")[0];
    const newUser = new User({ name, email, password, registrationDate });
    await newUser.save();

    // Fetch the full user object (excluding password)
    const userToSend = await User.findById(newUser._id).select("-password");
    res.status(201).json({ user: userToSend });
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

    // Fetch the full user object (excluding password)
    const userToSend = await User.findById(user._id).select("-password");
    res.status(200).json({ user: userToSend });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/attendance/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Sort attendance by date
    const sortedAttendance = [...user.attendance].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Count present days
    const presentRecords = sortedAttendance.filter(a => a.status === "Present");
    const presentCount = presentRecords.length;

    let nextPaymentDate = null;

    if (presentCount > 0 && presentCount < 30) {
      // Use the date of the first present (or registrationDate if no presents)
      const baseDate = presentRecords[0]?.date || user.registrationDate;
      const needed = 30 - presentCount;
      const expectedDate = new Date(baseDate);
      expectedDate.setDate(expectedDate.getDate() + needed);
      nextPaymentDate = expectedDate.toISOString().split("T")[0];
    } else if (presentCount >= 30) {
      // Find the date of the 30th present
      nextPaymentDate = presentRecords[29].date;
    }

    res.status(200).json({
      attendance: sortedAttendance,
      presentCount,
      nextPaymentDate,
      registrationDate: user.registrationDate
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add this to your Express server (server.js or routes file)
app.post("/user/:userId/mark-payment", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, date } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Add payment to user's payments array
    user.payments.push({
      date: date || new Date().toISOString().split("T")[0],
      amount: Number(amount),
      status: "Paid",
      remaining: 0,
      nextPaymentDate: null,
    });

    await user.save();
    res.json({ message: "Payment marked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});