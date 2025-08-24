import { createPinoHttp } from 'pino-http';
import pino from 'pino';

const LOGFLARE_API_KEY = process.env.REACT_APP_LOGFLARE_API_KEY;
const LOGFLARE_SOURCE_ID = process.env.REACT_APP_LOGFLARE_SOURCE_ID;

let transport;

if (LOGFLARE_API_KEY && LOGFLARE_SOURCE_ID) {
  transport = pino.transport({
    target: 'pino-logflare',
    options: {
      apiKey: LOGFLARE_API_KEY,
      source: LOGFLARE_SOURCE_ID,
    },
  });
}

const logger = pino(
  {
    level: 'info',
    base: {
      env: process.env.NODE_ENV,
    },
  },
  transport
);

export const logflareLogger = {
  debug: (message: string, ...args: any[]) => {
    logger.debug({ message, ...args });
  },

  info: (message: string, ...args: any[]) => {
    logger.info({ message, ...args });
  },

  warn: (message: string, ...args: any[]) => {
    logger.warn({ message, ...args });
  },

  error: (message: string, ...args: any[]) => {
    logger.error({ message, ...args });
  }
};
