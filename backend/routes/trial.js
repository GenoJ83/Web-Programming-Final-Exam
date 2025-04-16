const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const Register = require('../models/Register')


// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      address,
      emergencyContact,
      emergencyPhone,
      position,
      experience,
      qualifications,
      childrenCount,
      specialNeeds
    } = req.body;

    // Check if user exists
    let register = await Register.findOne({ email });
    if (register) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user instance
    register = new Register({
      firstName,
      lastName,
      email,
      password, // will be hashed below
      role,
      phoneNumber,
      address,
      emergencyContact,
      emergencyPhone,
      position,
      experience,
      qualifications,
      childrenCount,
      specialNeeds
    });

    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    // Save user to DB
    await register.save();

    // Create JWT payload
    const payload = {
      register: {
        id: register.id,
        role: register.role
      }
    };

    // Sign JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, register });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error');
  }
});





module.exports = router; 