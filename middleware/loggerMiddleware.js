// Logger Middleware
// Logs all incoming requests to data/logs.txt

const fs = require('fs');
const path = require('path');

// Create logger middleware
const loggerMiddleware = (req, res, next) => {
  const logsDir = path.join(__dirname, '..', 'data');
  const logsFile = path.join(logsDir, 'logs.txt');
  
  // Ensure data directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Create log message
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  
  const logMessage = `[${timestamp}] ${method} ${url} - IP: ${ip}\n`;
  
  // Append to logs file
  fs.appendFile(logsFile, logMessage, (err) => {
    if (err) {
      console.error('Error writing to logs file:', err);
    }
  });
  
  // Continue to next middleware
  next();
};

module.exports = loggerMiddleware;
