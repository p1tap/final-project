import mongoose, { Document } from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};


export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  name: string;
  bio: string;
  profilePicture: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export default mongoose.models.User || mongoose.model("User", UserSchema);