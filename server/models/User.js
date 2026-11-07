import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null }, // optional profile image (data URL)
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
