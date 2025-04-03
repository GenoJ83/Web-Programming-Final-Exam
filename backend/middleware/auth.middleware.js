const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: {
        id: decoded.id,
        isActive: true
      }
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Please authenticate.'
    });
  }
};

const isManager = async (req, res, next) => {
  try {
    if (req.user.role !== 'manager') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Manager privileges required.'
    });
  }
};

const isBabysitter = async (req, res, next) => {
  try {
    if (req.user.role !== 'babysitter') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Babysitter privileges required.'
    });
  }
};

module.exports = {
  auth,
  isManager,
  isBabysitter
}; 