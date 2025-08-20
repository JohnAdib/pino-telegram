import { ILogEntry } from '../types/ILogEntry';
import { TelegramApiError } from '../errors/TelegramApiError';
import { TelegramTransportError } from '../errors/TelegramTransportError';
import { formatMessage, IFormatMessageOptions } from './formatMessage';

/**
 * Options for sending a log entry to Telegram
 * 
 * @public
 */
export interface ISendToTelegramOptions {
  /** The log entry to send */
  log: ILogEntry;
  /** Telegram bot token */
  botToken: string;
  /** Telegram chat ID */
  chatId: string;
  /** Telegram parse mode (e.g., "HTML", "Markdown") */
  parseMode: string;
  /** Telegram API base URL */
  apiUrl: string;
  /** Include timestamp in message (default: false) */
  includeTimestamp?: boolean;
}

/**
 * Sends a formatted log entry to Telegram via the Bot API
 * 
 * @param options - Configuration options for sending to Telegram
 * @param options.log - The log entry to send
 * @param options.botToken - Telegram bot token
 * @param options.chatId - Telegram chat ID
 * @param options.parseMode - Telegram parse mode
 * @param options.apiUrl - Telegram API base URL
 * 
 * @throws {TelegramApiError} When Telegram API returns an error
 * @throws {TelegramTransportError} When network or other errors occur
 * 
 * @example
 * ```typescript
 * await sendToTelegram({
 *   log: { level: 50, msg: "Error occurred" },
 *   botToken: "123456:ABC-DEF...",
 *   chatId: "-123456789",
 *   parseMode: "HTML",
 *   apiUrl: "https://api.telegram.org"
 * });
 * ```
 * 
 * @public
 */
export async function sendToTelegram(options: ISendToTelegramOptions): Promise<void> {
  const { log, botToken, chatId, parseMode, apiUrl, includeTimestamp } = options;
  const message = formatMessage(log, { includeTimestamp });
  const url = `${apiUrl}/bot${botToken}/sendMessage`;
  
  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: parseMode
  };

  try {
    // Use Node.js built-in fetch (available since Node.js 18.0.0)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new TelegramApiError(response.status, errorText);
    }
  } catch (error) {
    if (error instanceof TelegramApiError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new TelegramTransportError(
      `Failed to send message to Telegram: ${errorMessage}`,
      error instanceof Error ? error : undefined
    );
  }
}
