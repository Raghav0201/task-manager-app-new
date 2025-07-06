// controllers/authController.js
require('dotenv').config();

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// ✅ Corrected: Only pass CLIENT_ID and CLIENT_SECRET here
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// 🔐 Local Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Local Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const googleLogin = (req, res) => {
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'select_account', // 👈 this forces account selection
    scope: ['profile', 'email'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI
  });

  res.redirect(authorizeUrl);
};


const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: "google",
        oauthProvider: "google",
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Redirect to React frontend with token
    const redirectUrl = `http://localhost:3000/auth/callback?token=${token}&name=${encodeURIComponent(
      user.name
    )}&email=${encodeURIComponent(user.email)}`;

    return res.redirect(redirectUrl);

  } catch (err) {
    console.error("Google Login Error:", err.message);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Google login failed",
        error: err.message,
      });
    }
  }
};


module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  googleCallback
};
