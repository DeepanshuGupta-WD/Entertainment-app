import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u._id, email: u.email, avatar: u.avatar || null });

router.post('/signup', async (req, res, next) => {
  try {
    const { email = '', password = '', avatar } = req.body;
    if (!EMAIL.test(email) || password.length < 6)
      return res.status(400).json({ message: 'Enter a valid email and a password of at least 6 characters' });
    if (avatar && (!avatar.startsWith('data:image/') || avatar.length > 700000))
      return res.status(400).json({ message: 'Profile image must be an image under 500 KB' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'An account with this email already exists' });

    const user = await User.create({ email, password: await bcrypt.hash(password, 10), avatar: avatar || null });
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { next(e); }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Account not found' });
    res.json(pub(user));
  } catch (e) { next(e); }
});

export default router;
