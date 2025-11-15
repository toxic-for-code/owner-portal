import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  role: 'user' | 'admin' | 'owner' | 'provider';
  status: 'active' | 'suspended';
  wishlist: mongoose.Types.ObjectId[];
  subscriptionPlan?: 'basic' | 'premium' | 'elite';
  subscriptionStatus?: 'inactive' | 'active';
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  paymentId?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: String,
    image: String,
    role: { type: String, enum: ['user', 'admin', 'owner', 'provider'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    subscriptionPlan: { type: String, enum: ['basic', 'premium', 'elite'], default: 'basic' },
    subscriptionStatus: { type: String, enum: ['inactive', 'active'], default: 'inactive' },
    subscriptionStart: { type: Date },
    subscriptionEnd: { type: Date },
    paymentId: { type: String },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Hall' }],
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);