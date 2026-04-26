import { Schema, model } from 'mongoose';
import { UserDocument } from '@core/types';

/**
 * User Schema Definition
 */
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Don't select by default
    },
    role: {
      type: String,
      enum: ['admin', 'viewer'],
      default: 'viewer',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index on username for login queries
userSchema.index({ username: 1 });

export const User = model<UserDocument>('users', userSchema);
