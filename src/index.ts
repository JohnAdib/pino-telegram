/**
 * Pino Telegram Transport
 * 
 * A robust, production-ready transport for sending Pino logs to Telegram.
 * Designed with TypeScript best practices, comprehensive error handling,
 * and optimal performance characteristics.
 * 
 * @packageDocumentation
 */

// === PRIMARY EXPORTS ===
export { TelegramTransport } from './TelegramTransport';
export { createTelegramTransport } from './createTelegramTransport';

// === TYPE EXPORTS ===
export type { 
  ITelegramTransportOptions, 
  ILogEntry 
} from './types';
export type { ISendToTelegramOptions } from './functions/sendToTelegram';
export type { IShouldSendLogOptions } from './functions/shouldSendLog';

// === ERROR EXPORTS ===
export { TelegramTransportError, TelegramApiError } from './errors';

// === UTILITY EXPORTS ===
export { 
  parseLog, 
  shouldSendLog, 
  getLevelName, 
  formatMessage, 
  sendToTelegram 
} from './functions';

// === CONSTANT EXPORTS ===
export { 
  LOG_LEVELS, 
  LEVEL_NAMES, 
  DEFAULT_LEVEL, 
  DEFAULT_LOG_LEVEL_VALUE,
  DEFAULT_PARSE_MODE, 
  DEFAULT_API_URL,
  MESSAGE_LENGTH_LIMIT,
  ThreadIdMapping
} from './constants';

// === DEFAULT EXPORT ===
export { createTelegramTransport as default } from './createTelegramTransport';
