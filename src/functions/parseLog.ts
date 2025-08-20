import { ILogEntry } from '../types/ILogEntry';
import { DEFAULT_LOG_LEVEL_VALUE } from '../constants/DEFAULT_LOG_LEVEL_VALUE';

/**
 * Parses a log chunk into a structured log entry
 * 
 * @param chunk - The log chunk to parse (string or already parsed object)
 * @returns Parsed and validated log entry
 * 
 * @example
 * ```typescript
 * const log = parseLog('{"level":30,"msg":"Hello","time":1234567890}');
 * console.log(log.msg); // "Hello"
 * ```
 * 
 * @public
 */
export function parseLog(chunk: string | ILogEntry): ILogEntry {
  if (typeof chunk !== 'string') {
    return chunk;
  }
  
  try {
    const parsed = JSON.parse(chunk);
    return parsed as ILogEntry;
  } catch {
    // Fallback for non-JSON strings
    return { 
      msg: chunk, 
      level: DEFAULT_LOG_LEVEL_VALUE,
      time: Date.now()
    };
  }
}
