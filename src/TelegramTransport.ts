import { Writable } from 'stream';
import { ITelegramTransportOptions, LogLevel } from './types/ITelegramTransportOptions';
import { ILogEntry } from './types/ILogEntry';
import { DEFAULT_LEVEL } from './constants/DEFAULT_LEVEL';
import { DEFAULT_PARSE_MODE } from './constants/DEFAULT_PARSE_MODE';
import { DEFAULT_API_URL } from './constants/DEFAULT_API_URL';

import { parseLog } from './functions/parseLog';
import { shouldSendLog } from './functions/shouldSendLog';
import { sendToTelegram } from './functions/sendToTelegram';
import { TelegramTransportError } from './errors/TelegramTransportError';
import { getLevelName } from './functions/getLevelName';

/**
 * A Pino transport for sending logs to Telegram via Bot API
 * 
 * This transport extends Node.js Writable stream and formats log entries
 * for optimal readability in Telegram chats with proper error handling.
 * 
 * @example
 * ```typescript
 * import pino from 'pino';
 * import { TelegramTransport } from 'pino-telegram';
 * 
 * const transport = new TelegramTransport({
 *   botToken: 'your-bot-token',
 *   chatId: 'your-chat-id',
 *   level: 'info'
 * });
 * 
 * const logger = pino(transport);
 * logger.info('Hello Telegram!');
 * ```
 * 
 * @public
 */
export class TelegramTransport extends Writable {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiUrl: string;
  private readonly level: LogLevel;
  private readonly onlyLevels?: LogLevel[];
  private readonly excludeLevels?: LogLevel[];
  private readonly parseMode: string;
  private readonly includeTimestamp: boolean;
  private readonly threadIds?: Record<string, number>;

  /**
   * Creates a new Telegram transport instance
   * 
   * @param options - Configuration options for the transport
   * @throws {TelegramTransportError} When required options are missing
   */
  constructor(options: ITelegramTransportOptions) {
    super({ objectMode: true });
    
    if (!options.botToken?.trim()) {
      throw new TelegramTransportError('botToken is required and cannot be empty');
    }
    
    if (!options.chatId?.trim()) {
      throw new TelegramTransportError('chatId is required and cannot be empty');
    }
    
    this.botToken = options.botToken.trim();
    this.chatId = options.chatId.trim();
    this.apiUrl = options.apiUrl?.trim() || DEFAULT_API_URL;
    this.level = options.level || DEFAULT_LEVEL;
    this.onlyLevels = options.onlyLevels;
    this.excludeLevels = options.excludeLevels;
    this.parseMode = options.parseMode || DEFAULT_PARSE_MODE;
    this.includeTimestamp = options.includeTimestamp ?? false;
    
    // Store thread IDs only if provided by user
    this.threadIds = options.threadIds;
  }

  /**
   * Internal write method called by the stream interface
   * 
   * @param chunk - Log data chunk to process
   * @param encoding - Character encoding (unused for object mode)
   * @param callback - Completion callback
   * 
   * @internal
   */
  _write(
    chunk: unknown, 
    encoding: BufferEncoding, 
    callback: (error?: Error | null) => void
  ): void {
    try {
      const log = parseLog(chunk as string | ILogEntry);
      
      if (!shouldSendLog({ 
        log, 
        minLevelName: this.level,
        onlyLevels: this.onlyLevels,
        excludeLevels: this.excludeLevels
      })) {
        callback();
        return;
      }
      
      // Get the level name and corresponding thread ID (only if user provided threadIds)
      const levelName = log.level !== undefined ? getLevelName(log.level) : undefined;
      const messageThreadId = levelName && this.threadIds && this.threadIds[levelName] !== undefined ? this.threadIds[levelName] : undefined;
      
      const sendOptions: any = {
        log,
        botToken: this.botToken,
        chatId: this.chatId,
        parseMode: this.parseMode,
        apiUrl: this.apiUrl,
        includeTimestamp: this.includeTimestamp
      };
      
      // Only add messageThreadId if it's defined
      if (messageThreadId !== undefined) {
        sendOptions.messageThreadId = messageThreadId;
      }
      
      sendToTelegram(sendOptions)
        .then(() => callback())
        .catch(error => {
          // Don't fail the logging pipeline, just emit error for monitoring
          this.emit('error', error);
          callback();
        });
    } catch (error) {
      // Handle synchronous errors in parsing
      this.emit('error', error);
      callback();
    }
  }

  /**
   * Gets the current configuration of the transport
   * 
   * @returns Readonly configuration object
   * @public
   */
  getConfig(): Readonly<{
    chatId: string;
    level: string;
    parseMode: string;
    apiUrl: string;
  }> {
    return {
      chatId: this.chatId,
      level: this.level,
      parseMode: this.parseMode,
      apiUrl: this.apiUrl
    };
  }
}
