import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function register(req, res) {
  try {
    // Read the body safely (it can be undefined if no JSON was sent)
    const { name, email, password } = req.body || {};

    // Check types first, so .trim() and .length never run on a number
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res
        .status(400)
        .json({ message: 'Name, email and password must be text' });
    }

    // Clean the input so validation and the lookup see the same values
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide name, email and password' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res
        .status(400)
        .json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }

    // Email already taken -> 409
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Hash the password (never store the plain one)
    const passwordHash = await bcrypt.hash(password, 10);

    // await: wait for the save to finish
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
    });

    // Send only the fields the contract allows (no hash)
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    // Two sign-ups at the same instant: the unique index rejects the second
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    console.error('Register failed:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}