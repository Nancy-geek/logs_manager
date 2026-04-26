import bcryptjs from 'bcryptjs';
import { config } from '@core/config';

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, config.bcryptRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}
