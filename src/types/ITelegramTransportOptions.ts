/**
 * Log level names supported by the transport
 * @public
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Telegram parse modes for message formatting
 * @public
 */
export type ParseMode = 'HTML' | 'Markdown' | 'MarkdownV2';

/**
 * Configuration options for the Telegram transport
 * @public
 */
export interface ITelegramTransportOptions {
  /** Telegram bot token obtained from @BotFather */
  readonly botToken: string;
  
  /** Telegram chat ID where logs will be sent */
  readonly chatId: string;
  
  /** Minimum log level to send (default: 'info') */
  readonly level?: LogLevel;
  
  /** Send only these specific log levels (takes priority over level) */
  readonly onlyLevels?: LogLevel[];
  
  /** Exclude these specific log levels from being sent */
  readonly excludeLevels?: LogLevel[];
  
  /** Telegram parse mode for message formatting (default: 'HTML') */
  readonly parseMode?: ParseMode;
  
  /** Include timestamp in messages (default: false, since Telegram shows message time) */
  readonly includeTimestamp?: boolean;
  
  /** Telegram API base URL (default: 'https://api.telegram.org') */
  readonly apiUrl?: string;
}
