import pino from 'pino';
import { config } from '@core/config';

/**
 * Pino logger instance
 */
const logger = pino({
  level: config.logLevel,
  transport:
    config.isDevelopment && process.stdout.isTTY
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        }
      : undefined,
});

export default logger;
