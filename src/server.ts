// src/server.ts

import { createApp } from "./app.js";
import { config } from "@core/config";

const start = async () => {
  try {
    const app = await createApp();

    await app.listen({ port: config.port, host: "0.0.0.0" });

    console.log(`
╔════════════════════════════════════════════════╗
║         📊 LOG INGESTOR & QUERY API            ║
╚════════════════════════════════════════════════╝

✅ Server running at: http://localhost:${config.port}

🔌 API Endpoints:
  • POST   /logs              - Ingest single log
  • POST   /logs/bulk         - Ingest multiple logs
  • POST   /auth/login        - Get JWT token
  • GET    /logs/search       - Search logs (auth required)
  • GET    /logs/statistics   - Get log statistics (auth required)
  • GET    /health            - Health check
  • GET    /metrics           - System metrics

🔑 Default Credentials:
  • Username: admin
  • Password: admin123

  • Username: viewer
  • Password: viewer123

� Environment: ${config.nodeEnv}
� Database: ${config.mongoUri}

Press CTRL+C to stop the server
`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
