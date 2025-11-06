import winston from 'winston';
import morgan from 'morgan';

const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(levelColors);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
    ),
  ),
  transports: [new winston.transports.Console()],
});

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message: string) => {
      const statusMatch = message.match(/" (\d{3}) /);
      if (statusMatch) {
        const statusCode = parseInt(statusMatch[1], 10);
        if (statusCode >= 500) {
          logger.error(message.trim());
        } else if (statusCode >= 400) {
          logger.warn(message.trim());
        } else {
          logger.info(message.trim());
        }
      } else {
        logger.info(message.trim());
      }
    },
  },
});

export { logger, morganMiddleware };
