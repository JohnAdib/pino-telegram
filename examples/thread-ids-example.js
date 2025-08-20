/**
 * Example: Using Message Thread IDs for Forum Organization
 * 
 * This example shows how to organize logs by level into separate
 * Telegram forum threads within a single chat.
 * 
 * NOTE: Thread IDs are OPTIONAL - only use them if you want forum organization.
 * Without threadIds, all logs go to the main chat thread.
 */

const pino = require('pino');

// Create logger with OPTIONAL thread ID organization
const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.LOGS_CHAT_ID,
      
      // OPTIONAL: Only specify if you want forum organization
      // Use thread IDs that match your Telegram forum setup
      threadIds: {
        info: 123,    // Send info logs to thread 123
        warn: 456,    // Send warn logs to thread 456
        error: 789,   // Send error logs to thread 789
        fatal: 999    // Send fatal logs to thread 999
        // trace and debug logs will go to main chat (no thread specified)
      }
    }
  }
});

// Now specified log levels will be sent to their threads!
logger.trace('🔍 Starting trace operation');        // → Main chat (no thread)
logger.debug('🐛 Debug information for development'); // → Main chat (no thread)
logger.info('ℹ️ Application started successfully');    // → Thread 123
logger.warn('⚠️ High memory usage detected');        // → Thread 456
logger.error('❌ Database connection failed');       // → Thread 789
logger.fatal('💥 Critical system failure');         // → Thread 999

console.log('✅ Logs sent to Telegram with optional thread organization!');
console.log('📱 Check your Telegram chat - specified levels are in their threads');
