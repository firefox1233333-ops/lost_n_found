const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT and attach user to request
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// Check if user is security officer
const requireSecurity = (req, res, next) => {
  if (!req.user || req.user.role !== 'security') {
    return res.status(403).json({ message: 'Security access only' });
  }
  next();
};

// Check if user is admin or security
const requireAdminOrSecurity = (req, res, next) => {
  if (!req.user || !['admin', 'security'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin or Security access only' });
  }
  next();
};

// Optionally attach user if valid token present (does not require auth)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch (_) {
    // ignore invalid token
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireSecurity,
  requireAdminOrSecurity,
};


