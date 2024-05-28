// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'pilnu';

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = { authenticate, SECRET_KEY };
