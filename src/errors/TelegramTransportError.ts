/**
 * Base error class for Telegram transport operations
 * @public
 */
export class TelegramTransportError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'TelegramTransportError';
    
    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TelegramTransportError);
    }
  }
}
