// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  googleCallback
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google/login', googleLogin);
router.get('/google/callback', googleCallback);

module.exports = router;
