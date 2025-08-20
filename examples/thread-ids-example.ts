/**
 * Example: Using Message Thread IDs for Forum Organization (TypeScript)
 * 
 * This example shows how to organize logs by level into separate
 * Telegram forum threads within a single chat with full type safety.
 * 
 * NOTE: Thread IDs are OPTIONAL - only use them if you want forum organization.
 * Without threadIds, all logs go to the main chat thread.
 */

import pino from 'pino';
import { ITelegramTransportOptions, ThreadIdMapping } from 'pino-telegram';

// Define OPTIONAL thread ID mapping for specific levels only
const customThreadIds: ThreadIdMapping = {
  info: 100,    // Send info logs to thread 100
  error: 200,   // Send error logs to thread 200
  fatal: 300    // Send fatal logs to thread 300
  // trace, debug, warn will go to main chat (no thread specified)
};

// Transport options with OPTIONAL thread IDs
const transportOptions: ITelegramTransportOptions = {
  botToken: process.env.TELEGRAM_BOT_TOKEN!,
  chatId: process.env.LOGS_CHAT_ID!,
  threadIds: customThreadIds  // OPTIONAL: remove this line for no thread organization
};

// Create logger with optional thread ID organization
const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: transportOptions
  }
});

// Now specified log levels will be sent to their threads!
logger.trace('🔍 Starting trace operation');          // → Main chat (no thread)
logger.debug('🐛 Debug information for development');  // → Main chat (no thread)
logger.info('ℹ️ Application started successfully');     // → Thread 100
logger.warn('⚠️ High memory usage detected');          // → Main chat (no thread)
logger.error('❌ Database connection failed');         // → Thread 200
logger.fatal('💥 Critical system failure');           // → Thread 300

console.log('✅ Logs sent to Telegram with optional thread organization!');
console.log('📱 Check your Telegram chat - specified levels are in their threads');
console.log('🧵 Thread IDs used:', customThreadIds);
