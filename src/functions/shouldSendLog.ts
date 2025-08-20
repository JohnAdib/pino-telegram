import { ILogEntry } from '../types/ILogEntry';
import { LogLevel } from '../types/ITelegramTransportOptions';
import { LOG_LEVELS } from '../constants/LOG_LEVELS';
import { DEFAULT_LOG_LEVEL_VALUE } from '../constants/DEFAULT_LOG_LEVEL_VALUE';
import { getLevelName } from './getLevelName';

/**
 * Options for checking if a log should be sent
 * 
 * @public
 */
export interface IShouldSendLogOptions {
  /** The log entry to evaluate */
  log: ILogEntry;
  /** The minimum level name to send */
  minLevelName?: LogLevel;
  /** Send only these specific log levels (takes priority over minLevelName) */
  onlyLevels?: LogLevel[];
  /** Exclude these specific log levels from being sent */
  excludeLevels?: LogLevel[];
}

/**
 * Determines if a log entry should be sent based on the configured filtering options
 * 
 * @param options - Configuration options for checking if log should be sent
 * @param options.log - The log entry to evaluate
 * @param options.minLevelName - The minimum level name to send (for backward compatibility)
 * @param options.onlyLevels - Send only these specific log levels (takes priority)
 * @param options.excludeLevels - Exclude these specific log levels from being sent
 * @returns True if the log should be sent to Telegram
 * 
 * @example
 * ```typescript
 * // Traditional min level filtering
 * const log = { level: 50, msg: "Error occurred" }; // error level
 * const shouldSend = shouldSendLog({ log, minLevelName: 'warn' }); // true (50 >= 40)
 * 
 * // Only specific levels
 * const shouldSend2 = shouldSendLog({ log, onlyLevels: ['error', 'fatal'] }); // true
 * 
 * // Exclude specific levels
 * const shouldSend3 = shouldSendLog({ log, minLevelName: 'info', excludeLevels: ['error'] }); // false
 * ```
 * 
 * @public
 */
export function shouldSendLog(options: IShouldSendLogOptions): boolean {
  const { log, minLevelName, onlyLevels, excludeLevels } = options;
  const logLevel = log.level ?? DEFAULT_LOG_LEVEL_VALUE;
  const logLevelName = getLevelName(logLevel) as LogLevel;

  // 1. If onlyLevels is specified, ONLY match those levels
  if (onlyLevels && onlyLevels.length > 0) {
    const shouldInclude = onlyLevels.includes(logLevelName);
    
    // Still respect excludeLevels even with onlyLevels
    if (excludeLevels && excludeLevels.includes(logLevelName)) {
      return false;
    }
    
    return shouldInclude;
  }

  // 2. Use traditional min level filtering if minLevelName is provided
  let shouldIncludeByLevel = true;
  if (minLevelName) {
    const minLevelValue = LOG_LEVELS[minLevelName];
    const minLevel = minLevelValue ?? DEFAULT_LOG_LEVEL_VALUE;
    shouldIncludeByLevel = logLevel >= minLevel;
  }
  
  // 3. Apply excludeLevels filter
  if (excludeLevels && excludeLevels.includes(logLevelName)) {
    return false;
  }

  return shouldIncludeByLevel;
}
