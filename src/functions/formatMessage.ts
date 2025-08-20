import { ILogEntry } from '../types/ILogEntry';
import { MESSAGE_LENGTH_LIMIT } from '../constants/MESSAGE_LENGTH_LIMIT';
import { DEFAULT_LOG_LEVEL_VALUE } from '../constants/DEFAULT_LOG_LEVEL_VALUE';
import { getLevelName } from './getLevelName';

/**
 * Options for formatting a log message
 * @public
 */
export interface IFormatMessageOptions {
  /** Include timestamp in message (default: false) */
  includeTimestamp?: boolean;
}

/**
 * Formats a log entry into a Telegram-compatible HTML message
 * 
 * @param log - The log entry to format
 * @param options - Formatting options
 * @returns HTML-formatted message string ready for Telegram
 * 
 * @example
 * ```typescript
 * const log = { level: 50, msg: "Database error", time: Date.now() };
 * const message = formatMessage(log, { includeTimestamp: true });
 * // Returns: "<b>[ERROR]</b> 2024-01-01T12:00:00.000Z\nDatabase error"
 * ```
 * 
 * @public
 */
export function formatMessage(log: ILogEntry, options: IFormatMessageOptions = {}): string {
  const level = getLevelName(log.level ?? DEFAULT_LOG_LEVEL_VALUE);
  const message = log.msg ?? 'No message';
  
  let formatted = `<b>[${level.toUpperCase()}]</b>`;
  
  if (options.includeTimestamp) {
    const timestamp = new Date(log.time ?? Date.now()).toISOString();
    formatted += ` ${timestamp}`;
  }
  
  formatted += `\n${message}`;
  
  // Add error details if present
  if (log.err) {
    const errorMessage = typeof log.err === 'object' && 'message' in log.err 
      ? log.err.message 
      : String(log.err);
    
    formatted += `\n\n<b>Error:</b> ${errorMessage}`;
    
    if (typeof log.err === 'object' && 'stack' in log.err && log.err.stack) {
      formatted += `\n<pre>${log.err.stack}</pre>`;
    }
  }
  
  // Add additional context if present
  const contextKeys = Object.keys(log).filter(key => 
    !['time', 'level', 'msg', 'err', 'pid', 'hostname', 'v'].includes(key)
  );
  
  if (contextKeys.length > 0) {
    formatted += '\n';
    for (const key of contextKeys) {
      const value = typeof log[key] === 'object' 
        ? JSON.stringify(log[key]) 
        : String(log[key]);
      formatted += `\n- ${key}: <code>${value}</code>`;
    }
  }
  
  // Truncate if message is too long for Telegram
  if (formatted.length > MESSAGE_LENGTH_LIMIT) {
    formatted = formatted.substring(0, MESSAGE_LENGTH_LIMIT) + 
      '...\n<i>(message truncated)</i>';
  }
  
  return formatted;
}
