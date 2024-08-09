const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "ojiq390gwaeijobnijew09ahowjt3p9";


function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };