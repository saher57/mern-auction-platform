const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Debug: Show the received Authorization header
  console.log('Authorization Header:', authHeader);

  // Check if the Authorization header is missing or malformed
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or token format is invalid' });
  }

  // Extract token from the header
  const token = authHeader.split(' ')[1];

  // Debug: Show the extracted token
  console.log('Extracted Token:', token);

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug: log the decoded user info
    console.log('Authenticated user:', decoded);

    // Attach user info to request object
    req.user = decoded;

    next(); // Move to next middleware or route
  } catch (error) {
    // Debug: log the error
    console.error('Token verification error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }

    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;














// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.header('Authorization');

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   const token = authHeader.split(' ')[1]; // safer than replace()

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Debug: log the decoded user info
//     console.log('Authenticated user:', decoded);

//     req.user = decoded; // now you can access req.user in routes
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);

//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token' });
//     }

//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired' });
//     }

//     res.status(401).json({ message: 'Authentication failed' });
//   }
// };

// module.exports = authMiddleware;













// const jwt = require('jsonwebtoken');
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
  
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     // Verify with the same secret used to sign
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
    
//     // More specific error messages
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired' });
//     }
    
//     res.status(401).json({ message: 'Authentication failed' });
//   }
// };

// module.exports = authMiddleware;





// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   console.log('Token received in authMiddleware:', token); // Debug log

//   if (!token) {
//     console.log('No token provided');
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded token:', decoded); // Debug log
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error.message);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = authMiddleware;