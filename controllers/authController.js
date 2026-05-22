// Authentication Controller
// Handles user registration, login, and logout

const User = require('../models/User');
const EventEmitter = require('events');

// Create event emitter for authentication events
const authEvents = new EventEmitter();

// Registration controller
exports.registerPage = (req, res) => {
  res.render('register', { title: 'Register' });
};

// Handle registration
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).render('register', {
        title: 'Register',
        error: 'All fields are required'
      });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).render('register', {
        title: 'Register',
        error: 'Passwords do not match'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('register', {
        title: 'Register',
        error: 'Email already registered'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: 'student'
    });
    
    // Emit userRegistered event
    authEvents.emit('userRegistered', { userId: user._id, email: user.email });
    console.log(`✓ Event: User registered - ${email}`);
    
    // Set session
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.role = user.role;
    
    // Redirect to dashboard
    res.redirect('/dashboard');
    
  } catch (error) {
    next(error);
  }
};

// Login page
exports.loginPage = (req, res) => {
  res.render('login', { title: 'Login' });
};

// Handle login
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    
    // Validation
    if (!email || !password || !role) {
      return res.status(400).render('login', {
        title: 'Login',
        error: 'Email, password, and role are required'
      });
    }
    
    // Find user by email and role
    const user = await User.findOne({ email, role });
    
    if (!user) {
      return res.status(401).render('login', {
        title: 'Login',
        error: 'Invalid email or password for selected role'
      });
    }
    
    // Check password (simple comparison - in production use bcrypt)
    if (user.password !== password) {
      return res.status(401).render('login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }
    
    // Emit userLogin event
    authEvents.emit('userLogin', { userId: user._id, role: user.role });
    console.log(`✓ Event: User logged in - ${email} (${role})`);
    
    // Set session
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.role = user.role;
    
    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/dashboard');
    }
    
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.redirect('/');
  });
};

module.exports = exports;
