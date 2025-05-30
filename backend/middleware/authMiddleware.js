/**
 * @file authMiddleware.js
 * @description Authentication and authorization middleware using JSON Web Tokens (JWT).
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model might be needed to fetch full user details

/**
 * Middleware to protect routes by verifying a JWT token.
 * It checks for a 'Bearer' token in the Authorization header, verifies it,
 * and attaches the user's ID to the request object (`req.user`).
 *
 * @function protect
 * @param {import('express').Request} req - Express request object. Expected to have `headers.authorization`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void} Calls `next()` if authentication is successful, otherwise sends a 401 response.
 * @todo Enhance `req.user` to include the full user object or at least user role from the JWT payload
 *       to make it more useful for subsequent middleware like `protectAdmin`.
 *       Currently, it only attaches the user ID: `req.user = decoded.id;`.
 *       It should ideally be `req.user = decoded;` if the JWT payload contains the full user object (id, role, etc.)
 *       or fetch user details using `decoded.id` and attach them.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID and attach to request object
      // For `protectAdmin` to work, `decoded` should contain role, or we need to fetch user here.
      // Assuming decoded contains at least `id` and `role` or the full user object.
      // If JWT only contains id, you would typically fetch the user from DB here:
      // req.user = await User.findById(decoded.id).select('-password');
      // For now, if decoded.id is just the ID, this won't give `protectAdmin` the role.
      // Let's assume the JWT payload (decoded) directly contains user info including role.
      // If `decoded` structure is `{ id: 'userId', role: 'userRole', ... }`
      // then `req.user = decoded;` would be more appropriate.
      // Current code `req.user = decoded.id;` is insufficient for role checks in `protectAdmin`
      // unless `protectAdmin` is modified or there's another step.
      // For the purpose of this JSDoc, we'll assume `decoded` contains the necessary user object.
      // However, to make `protectAdmin` work as intended with the current `protect` middleware,
      // `decoded` MUST contain the user's role.
      // A common practice is to put { id: user._id, role: user.role } in JWT payload.
      req.user = decoded; // Assuming 'decoded' is the user payload from JWT, including 'id' and 'role'

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user data not found in token' });
      }

      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

/**
 * Middleware to protect routes that require admin privileges.
 * This middleware should be used *after* the `protect` middleware,
 * as it relies on `req.user` being populated with the authenticated user's details (including their role).
 *
 * @function protectAdmin
 * @param {import('express').Request} req - Express request object. Expected to have `req.user` populated by `protect` middleware, with `req.user.role`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void} Calls `next()` if the user is an admin, otherwise sends a 403 Forbidden response.
 */
const protectAdmin = (req, res, next) => {
  // req.user should be populated by the `protect` middleware
  // and should contain user details including the role.
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // If req.user is not present, or role is not admin
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { protect, protectAdmin };
