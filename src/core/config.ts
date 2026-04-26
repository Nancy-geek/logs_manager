import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // MongoDB
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/log_ingestor',
  mongoDbName: process.env.MONGODB_DB_NAME || 'log_ingestor',
  mongoTimeout: parseInt(process.env.MONGODB_TIMEOUT || '10000', 10),

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_key_change_this',
  jwtExpire: process.env.JWT_EXPIRE || '1h',

  // Buffer Configuration
  logBufferSize: parseInt(process.env.LOG_BUFFER_SIZE || '100', 10),
  logBufferFlushMs: parseInt(process.env.LOG_BUFFER_FLUSH_MS || '500', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Password
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
};

// Validate required config
if (!config.jwtSecret || config.jwtSecret === 'your_super_secret_key_change_this') {
  console.warn('⚠️  WARNING: JWT_SECRET is using default value. Set it in .env file!');
}
