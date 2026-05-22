// Authentication Middleware
// Protects routes and validates user authentication and role-based access

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Check if user is stored in session/request
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Check if user is authenticated and is an admin
const isAdmin = (req, res, next) => {
  // First check if authenticated
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  
  // Check if user has admin role
  if (req.session.role !== 'admin') {
    return res.status(403).render('error', {
      statusCode: 403,
      message: 'Access Denied. Admin role required.'
    });
  }
  
  next();
};

// Check if user is authenticated and is a student
const isStudent = (req, res, next) => {
  // First check if authenticated
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  
  // Check if user has student role
  if (req.session.role !== 'student') {
    return res.status(403).render('error', {
      statusCode: 403,
      message: 'Access Denied. Student role required.'
    });
  }
  
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isStudent
};
