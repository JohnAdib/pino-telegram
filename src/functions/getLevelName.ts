import { LEVEL_NAMES } from '../constants/LEVEL_NAMES';
import { DEFAULT_LEVEL } from '../constants/DEFAULT_LEVEL';

/**
 * Converts a numeric log level to its string representation
 * 
 * @param level - The numeric log level
 * @returns The corresponding level name string
 * 
 * @example
 * ```typescript
 * const levelName = getLevelName(50); // "error"
 * const unknown = getLevelName(999); // "trace" (fallback)
 * ```
 * 
 * @public
 */
export function getLevelName(level: number): string {
  return LEVEL_NAMES[level as keyof typeof LEVEL_NAMES] ?? DEFAULT_LEVEL;
}
