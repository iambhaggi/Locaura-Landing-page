const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("/*", cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
require("dotenv").config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Comprehensive Waitlist Schema
const WaitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  segment: { type: String, enum: ['shop', 'sell', 'deliver'], default: 'shop' },
  city: String,
  phone: String,
  referredBy: String,
  referralCount: { type: Number, default: 0 },
  promoCode: { type: String, unique: true },
  promoUsed: { type: Boolean, default: false },
  freeDeliveryCount: { type: Number, default: 1 }, // 1 free delivery per waitlist member
  timestamp: { type: Date, default: Date.now }
});

const Waitlist = mongoose.model("Waitlist", WaitlistSchema);

// Comprehensive Retailer Schema
const RetailerSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  shopName: String,
  location: String,
  timestamp: { type: Date, default: Date.now }
});

const Retailer = mongoose.model("Retailer", RetailerSchema);

// Generate unique promo code
function generatePromoCode(email, count) {
  // Format: LOCAURA + Random code + Email hash
  const prefix = "LOCAURA";
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
  const emailHash = email.substring(0, 3).toUpperCase(); // First 3 letters of email
  const randomNum = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random chars
  return `${prefix}${emailHash}${randomNum}${timestamp}`;
}

// API Endpoints
app.post("/waitlist", async (req, res) => {
  try {
    const { name, email, segment = 'shop', city = 'Vizag', phone = '', referredBy = '' } = req.body;

    // Check if email already exists
    const existingUser = await Waitlist.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered", user: existingUser });
    }

    const newUser = new Waitlist({ 
      name, 
      email, 
      segment, 
      city, 
      phone, 
      referredBy,
      promoCode: generatePromoCode(email)
    });
    
    await newUser.save();

    // If referral, update referrer's count
    if (referredBy) {
      await Waitlist.updateOne({ email: referredBy }, { $inc: { referralCount: 1 } });
    }

    res.json({ 
      message: "Successfully registered!", 
      user: newUser,
      promoCode: newUser.promoCode,
      benefit: "Free same-day delivery"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retailer Partnership Registration
app.post("/retailer", async (req, res) => {
  try {
    const { name, email, mobile, shopName, location } = req.body;

    const newRetailer = new Retailer({ name, email, mobile, shopName, location });
    await newRetailer.save();

    res.json({ message: "Retailer registered successfully", retailer: newRetailer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get waitlist stats
app.get("/stats", async (req, res) => {
  try {
    const totalWaitlist = await Waitlist.countDocuments();
    const shopSegment = await Waitlist.countDocuments({ segment: 'shop' });
    const sellSegment = await Waitlist.countDocuments({ segment: 'sell' });
    const deliverSegment = await Waitlist.countDocuments({ segment: 'deliver' });

    res.json({
      totalWaitlist,
      segments: { shopSegment, sellSegment, deliverSegment },
      cityDistribution: await Waitlist.aggregate([
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate Promo Code - Check if code exists and is valid
app.post("/promo/validate", async (req, res) => {
  try {
    const { promoCode } = req.body;

    if (!promoCode) {
      return res.status(400).json({ error: "Promo code is required" });
    }

    const user = await Waitlist.findOne({ promoCode: promoCode.toUpperCase() });

    if (!user) {
      return res.status(404).json({ error: "Invalid promo code" });
    }

    if (user.promoUsed) {
      return res.status(400).json({ error: "Promo code already used" });
    }

    res.json({
      valid: true,
      message: "Promo code is valid!",
      benefit: "Free same-day delivery on your first order",
      userName: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply Promo Code - Mark code as used and give discount
app.post("/promo/apply", async (req, res) => {
  try {
    const { promoCode, orderId } = req.body;

    if (!promoCode) {
      return res.status(400).json({ error: "Promo code is required" });
    }

    const user = await Waitlist.findOne({ promoCode: promoCode.toUpperCase() });

    if (!user) {
      return res.status(404).json({ error: "Invalid promo code" });
    }

    if (user.promoUsed) {
      return res.status(400).json({ error: "Promo code has already been used" });
    }

    // Mark promo as used
    user.promoUsed = true;
    await user.save();

    res.json({
      success: true,
      message: "Free delivery applied to your order!",
      discount: "₹0 delivery charge",
      orderId: orderId,
      user: user.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Promo Code - Retrieve promo code by email (for lost code)
app.post("/promo/retrieve", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await Waitlist.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email not found in waitlist" });
    }

    res.json({
      promoCode: user.promoCode,
      name: user.name,
      benefit: "Free same-day delivery",
      used: user.promoUsed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Locaura Server running on port ${PORT}`));