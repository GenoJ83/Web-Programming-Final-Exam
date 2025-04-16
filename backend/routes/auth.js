const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const Register = require('../models/Register')



router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const register = await Register.findOne({ email });

      if (!register) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await register.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update last login time
      register.lastLogin = new Date();
      await register.save();

      // Generate JWT token using model method
      const token = register.generateAuthToken();

      // Only return safe user data
      const {
        _id: id,
        firstName,
        lastName,
        email: safeEmail,
        role,
        phoneNumber,
        address
      } = register;

      res.json({
        token,
        register: {
          id,
          firstName,
          lastName,
          email: safeEmail,
          role,
          phoneNumber,
          address
        }
      });
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
// router.post(
//   '/register',
//   [
//     body('firstName', 'First name is required').not().isEmpty(),
//     body('lastName', 'Last name is required').not().isEmpty(),
//     body('email', 'Please include a valid email').isEmail(),
//     body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
//     body('role', 'Role is required').isIn(['manager', 'babysitter', 'parent'])
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstName, lastName, email, password, role, phoneNumber, address, 
//         emergencyContact,
//         emergencyPhone,
//         childrenCount,
//         specialNeeds,
//         position,
//         experience,
//         qualifications
//     } = req.body;

//     try {
//       let user = await User.findOne({ email });

//       if (user) {
//         return res.status(400).json({ message: 'User already exists' });
//       }

//       user = new User({
//         firstName,
//         lastName,
//         email,
//         password,
//         role,
//         phoneNumber,
//         address,
//         emergencyContact,
//         emergencyPhone,
//         childrenCount,
//         specialNeeds,
//         position,
//         experience,
//         qualifications
//       });

//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);

//       await user.save();

//       const payload = {
//         user: {
//           id: user.id,
//           role: user.role
//         }
//       };

//       jwt.sign(
//         payload,
//         process.env.JWT_SECRET,
//         { expiresIn: '24h' },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token, user });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// router.post('/register', async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       role,
//       phoneNumber,
//       address,
//       emergencyContact,
//       emergencyPhone,
//       position,
//       experience,
//       qualifications,
//       childrenCount,
//       specialNeeds
//     } = req.body;

//     // Check if user exists
//     let register = await Register.findOne({ email });
//     if (register) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     // Create new user instance
//     register = new Register({
//       firstName,
//       lastName,
//       email,
//       password, // will be hashed below
//       role,
//       phoneNumber,
//       address,
//       emergencyContact,
//       emergencyPhone,
//       position,
//       experience,
//       qualifications,
//       childrenCount,
//       specialNeeds
//     });

//     // Hash password
//     // const salt = await bcrypt.genSalt(10);
//     // user.password = await bcrypt.hash(password, salt);

//     // Save user to DB
//     await register.save();

//     // Create JWT payload
//     const payload = {
//       register: {
//         id: register.id,
//         role: register.role
//       }
//     };

//     // Sign JWT
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token, register });
//       }
//     );
//   } catch (err) {
//     console.error('Registration error:', err.message);
//     res.status(500).send('Server error');
//   }
// });

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const register = await Register.findById(req.register.id).select('-password');
    res.json(register);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    auth,
    [
      body('firstName', 'First name is required').not().isEmpty(),
      body('lastName', 'Last name is required').not().isEmpty(),
      body('email', 'Please include a valid email').isEmail()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phoneNumber, address } = req.body;

    try {
      let register = await Register.findById(req.register.id);

      if (!register) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if email is already taken by another user
      if (email !== register.email) {
        const existingRegister = await Register.findOne({ email });
        if (existingRegister) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      register.firstName = firstName;
      register.lastName = lastName;
      register.email = email;
      register.phoneNumber = phoneNumber;
      register.address = address;

      await register.save();

      res.json(register);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router; 