import { User } from '../modules/database/User.model.js';
import { Log } from '../modules/database/Log.model.js';
import { connectDB, disconnectDB } from '../db/connection.js';
import { hashPassword } from '../utils/password.js';
import logger from '../utils/logger.js';

/**
 * Seed script - Create default users and sample logs
 */
async function seed() {
  try {
    logger.info('🌱 Starting database seeding...');

    await connectDB();

    // Clear existing data
    logger.info('Clearing existing users and logs...');
    await User.deleteMany({});
    await Log.deleteMany({});

    // Create admin user
    logger.info('Creating admin user...');
    const adminPasswordHash = await hashPassword('admin123');
    await User.create({
      username: 'admin',
      email: 'admin@localhost',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true,
    });

    // Create viewer user
    logger.info('Creating viewer user...');
    const viewerPasswordHash = await hashPassword('viewer123');
    await User.create({
      username: 'viewer',
      email: 'viewer@localhost',
      passwordHash: viewerPasswordHash,
      role: 'viewer',
      isActive: true,
    });

    // Create sample logs
    logger.info('Creating sample logs...');
    const sampleLogs = [
      {
        level: 'info',
        message: 'Application started successfully',
        resourceId: 'server-001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        traceId: 'trace-001',
        spanId: 'span-001',
        commit: 'abc123def',
      },
      {
        level: 'info',
        message: 'Database connected',
        resourceId: 'server-001',
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
        traceId: 'trace-001',
        spanId: 'span-002',
        commit: 'abc123def',
      },
      {
        level: 'warn',
        message: 'High memory usage detected',
        resourceId: 'server-002',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        traceId: 'trace-002',
        spanId: 'span-003',
      },
      {
        level: 'error',
        message: 'Failed to connect to cache service',
        resourceId: 'server-002',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        traceId: 'trace-003',
        spanId: 'span-004',
        commit: 'xyz789abc',
      },
      {
        level: 'error',
        message: 'Database query timeout',
        resourceId: 'server-003',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        traceId: 'trace-004',
        spanId: 'span-005',
      },
      {
        level: 'debug',
        message: 'Processing user request',
        resourceId: 'api-gateway',
        timestamp: new Date(),
        traceId: 'trace-005',
        spanId: 'span-006',
      },
    ];

    await Log.insertMany(sampleLogs);

    logger.info('✅ Database seeding completed!');
    logger.info('👤 Admin user: admin / admin123');
    logger.info('👤 Viewer user: viewer / viewer123');
    logger.info(`📊 Created ${sampleLogs.length} sample logs`);

    await disconnectDB();
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
