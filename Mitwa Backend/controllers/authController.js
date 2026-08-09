import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ msg: "All fields required" });
    }

    if (phone.length !== 10) {
      return res.status(400).json({ msg: "Invalid phone number" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "customer"
    });

    res.json({ message: "User registered", user });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE STAFF (admin only)
export const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      password: hashed,
      role: "staff"
    });

    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
