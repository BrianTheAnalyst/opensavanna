import { logflareLogger } from './logflareLogger';
import { processingLogger as consoleLogger } from '../processing/processingLogger';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = isProduction && process.env.REACT_APP_LOGFLARE_API_KEY
  ? logflareLogger
  : consoleLogger;
