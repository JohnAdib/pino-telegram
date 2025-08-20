/**
 * Represents a structured log entry from Pino
 * @public
 */
export interface ILogEntry {
  /** Timestamp of the log entry (Unix timestamp or ISO string) */
  readonly time?: number | string;
  
  /** Numeric log level (10=trace, 20=debug, 30=info, 40=warn, 50=error, 60=fatal) */
  readonly level?: number;
  
  /** Primary log message */
  readonly msg?: string;
  
  /** Error object or error-like structure */
  readonly err?: Error | { 
    readonly message?: string; 
    readonly stack?: string; 
  };
  
  /** Additional context properties */
  readonly [key: string]: unknown;
}
