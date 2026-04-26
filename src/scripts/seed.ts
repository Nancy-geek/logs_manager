// src/scripts/seed.ts

import mongoose from 'mongoose';
import { User } from '@modules/database/User.model';
import { hashPassword } from '@shared/utils/password';
import { config } from '@core/config';

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Connect to MongoDB
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: config.mongoTimeout,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("🗑️ Cleared existing users");

    // Create admin user
    const adminPasswordHash = await hashPassword("admin123");
    const adminUser = new User({
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      isActive: true,
    });
    await adminUser.save();
    console.log("✅ Created admin user");

    // Create viewer user
    const viewerPasswordHash = await hashPassword("viewer123");
    const viewerUser = new User({
      username: "viewer",
      email: "viewer@example.com",
      passwordHash: viewerPasswordHash,
      role: "viewer",
      isActive: true,
    });
    await viewerUser.save();
    console.log("✅ Created viewer user");

    console.log(`
🎉 Database seeded successfully!

📝 Default Users:
  Admin:
    - Username: admin
    - Password: admin123
    - Role: admin

  Viewer:
    - Username: viewer
    - Password: viewer123
    - Role: viewer
`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
