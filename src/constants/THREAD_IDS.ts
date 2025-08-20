import { LogLevel } from "../types";

/**
 * Type for thread ID mapping
 * Maps log level names to their corresponding Telegram message thread IDs
 * @public
 */
export type ThreadIdMapping = Partial<Record<LogLevel, number>>;
