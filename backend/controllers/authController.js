const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All Fields are compulsary!' });
  }
  
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already exsist' });
  
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
  res.json({ token, user: { id: user._id, name, email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not Found' });
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Wrong Password' });
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
  res.json({ token, user: { id: user._id, name: user.name, email } });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
};