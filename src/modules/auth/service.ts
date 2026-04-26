import jwt from 'jsonwebtoken';
import { User } from '@modules/database/User.model';
import { config } from '@core/config';
import { JwtPayload, UserDocument } from '@core/types';
import { hashPassword, comparePassword } from '@shared/utils/password';
import logger from '@shared/utils/logger';

/**
 * Authentication Service
 * Handles user authentication, token generation
 */
export class AuthService {
  /**
   * Login user and generate JWT token
   */
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const user = await User.findOne({ username, isActive: true }).select('+passwordHash');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Generate JWT token
   */
  generateToken(user: UserDocument): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: user._id?.toString() || '',
      username: user.username,
      role: user.role,
    };

    return jwt.sign(
      payload,
      config.jwtSecret as jwt.Secret,
      { expiresIn: config.jwtExpire } as jwt.SignOptions
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  }

  /**
   * Create a new user
   */
  async createUser(username: string, password: string, role: 'admin' | 'viewer' = 'viewer', email?: string): Promise<UserDocument> {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const passwordHash = await hashPassword(password);

    const newUser = new User({
      username,
      passwordHash,
      role,
      email,
      isActive: true,
    });

    await newUser.save();
    logger.info(`New user created: ${username}`);

    return newUser;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserDocument | null> {
    return User.findById(userId);
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<UserDocument | null> {
    return User.findOne({ username });
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { isActive: false });
    logger.info(`User deactivated: ${userId}`);
  }
}
