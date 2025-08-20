import { ITelegramTransportOptions } from './types/ITelegramTransportOptions';
import { TelegramTransport } from './TelegramTransport';

/**
 * Factory function to create a new Telegram transport instance
 * 
 * This is the recommended way to create transport instances as it provides
 * a clean functional interface and better tree-shaking support.
 * 
 * @param options - Configuration options for the transport
 * @returns A new TelegramTransport instance
 * 
 * @example
 * ```typescript
 * import pino from 'pino';
 * import { createTelegramTransport } from 'pino-telegram';
 * 
 * const transport = createTelegramTransport({
 *   botToken: process.env.TELEGRAM_BOT_TOKEN!,
 *   chatId: process.env.TELEGRAM_CHAT_ID!,
 *   level: 'warn'
 * });
 * 
 * const logger = pino(transport);
 * ```
 * 
 * @public
 */
export function createTelegramTransport(options: ITelegramTransportOptions): TelegramTransport {
  return new TelegramTransport(options);
}
