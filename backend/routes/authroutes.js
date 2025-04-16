const express = require ('express')
const router = express.Router()
const connection = require('../models/db')
const bcrypt = require('bcrypt');


router.post('/register', async (req, res) => {
    console.log(req.body);
    const { 
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
        phoneNumber,
        address,
        emergencyContact,
        emergencyPhone,
        position,
        experience,
        qualifications,
        childrenCount,
        specialNeeds,
     } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Convert empty string to NULL for childrenCount
      const finalChildrenCount = childrenCount === '' ? null : childrenCount;

  
      // Insert new user into the database
      const sql = `
  INSERT INTO users (
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
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
  firstName,
  lastName,
  email,
  hashedPassword,
  role,
  phoneNumber,
  address,
  emergencyContact,
  emergencyPhone,
  position,
  experience,
  qualifications,
  finalChildrenCount,
  specialNeeds
];

  
      await new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    // Query to get user by email
    const query = 'SELECT * FROM users WHERE email = ?'; 
  
    connection.execute(query, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Internal server error' });
        }
      }
  
      if (results.length === 0) {
        if (!res.headersSent) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      }
  
      const user = results[0];
  
      // Compare hashed password with bcrypt
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          if (!res.headersSent) {
            return res.status(500).json({ error: 'Internal server error' });
          }
        }
  
        if (!isMatch) {
          if (!res.headersSent) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
        }
  
        // Password is correct, send the response
        if (!res.headersSent) {
          return res.status(200).json({
            message: 'Login successful',
            token: 'your-jwt-token',
            role: user.role,
          });
        }
      });
    });
});
  




  module.exports = router;