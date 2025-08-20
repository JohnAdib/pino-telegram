import { TelegramTransportError } from './TelegramTransportError';

/**
 * Error thrown when Telegram API returns an error response
 * @public
 */
export class TelegramApiError extends TelegramTransportError {
  constructor(
    public readonly statusCode: number,
    public readonly responseText: string,
    cause?: Error
  ) {
    super(`Telegram API error: ${statusCode} ${responseText}`, cause);
    this.name = 'TelegramApiError';
  }
}
