# 📱 pino-telegram

> 🆓 **FREE** logging for your projects! No costs, no limits, just reliable log through Telegram.

The ultimate **[Pino](https://getpino.io)** transport that sends your application logs directly to **[Telegram](https://telegram.org)** - completely free and perfect for startups, side projects, and production applications that need reliable logging without breaking the bank!

[![npm version](https://badge.fury.io/js/pino-telegram.svg)](https://badge.fury.io/js/pino-telegram)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/pino-telegram.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🎯 Why Choose pino-telegram?

### 💰 **Absolutely FREE**
- **No subscription fees** - Telegram is completely free
- **No usage limits** - Send unlimited logs 
- **No vendor lock-in** - Own your logging infrastructure
- **Perfect for startups** - Start logging immediately without worrying about costs

### 🚀 **Production Ready**
- **Real-time notifications** - Get instant alerts on your phone
- **Rich formatting** - HTML, Markdown support with error stack traces
- **Smart filtering** - Only send logs that matter (configurable levels)
- **TypeScript native** - Full type safety and IntelliSense support

### 📱 **Accessible Anywhere**
- **Mobile first** - Monitor your apps from anywhere
- **Team collaboration** - Add team members to your logging channel
- **Cross-platform** - Works on iOS, Android, Desktop, Web

---

## 🚀 Quick Start (2 minutes setup!)

### 1️⃣ Install the package

```bash
npm install pino-telegram
```

```bash
# or
yarn add pino-telegram
# or
pnpm add pino-telegram
# or
bun add pino-telegram
```

### 2️⃣ Create a Telegram Bot (30 seconds)

1. **Open Telegram** and search for [@BotFather](https://t.me/botfather)
2. **Start a chat** and send `/newbot`
3. **Follow the prompts** to create your bot
4. **Copy the bot token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

> 💡 **Pro tip**: Save the bot token securely - you'll need it for your app!

### 3️⃣ Get Your Chat ID

**Option A: Quick method**
1. **Start a chat** with your new bot
2. **Send any message** to your bot  
3. **Visit**: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. **Find the chat ID** in the JSON response (`message.chat.id`)

**Option B: Add to group**
1. **Create a group** and add your bot
2. **Send a message** in the group
3. **Visit the same URL** above
4. **Use the group chat ID** (negative number)

### 4️⃣ Start Logging!

```javascript
const pino = require('pino');

export const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: 'YOUR_BOT_TOKEN',
      chatId: 'YOUR_CHAT_ID'
    }
  }
});
```

```javascript
import { logger } from './logger'

// Your logs now go directly to Telegram! 🎉
logger.info('🚀 Application started successfully!');
logger.warn('⚠️ High memory usage detected');
logger.error('💥 Database connection failed', { 
  error: 'Connection timeout',
  retries: 3 
});
```

### 📱 What You'll See in Telegram

After running the code above, you'll receive formatted messages in your Telegram chat:

> 💡 **Note:** Timestamps are optional since Telegram shows message time. The format shown below is with timestamps disabled (recommended).

<table>
<tr>
<td width="50%">

**📱 Telegram Message 1:**
```
[INFO] 🚀 Application started successfully!
```

</td>
<td width="50%">

**📱 Telegram Message 2:**
```
[WARN] ⚠️ High memory usage detected
```

</td>
</tr>
<tr>
<td colspan="2">

**📱 Telegram Message 3:**
```
[ERROR] 💥 Database connection failed

- error: <code>Connection timeout</code>
- retries: <code>3</code>
```

</td>
</tr>
</table>

---

## 📚 Usage Examples

### 🏗️ Basic Setup

```javascript
const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      level: 'info' // Send info, warn, error, fatal
    }
  }
});

logger.info('User registered', { userId: 123, email: 'user@example.com' });
```

### 🎯 Production Configuration

```javascript
const pino = require('pino');

const logger = pino({
  transport: {
    targets: [
      // Send errors to Telegram
      {
        target: 'pino-telegram',
        level: 'error',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.TELEGRAM_CHAT_ID,
          parseMode: 'HTML'
        }
      },
      // Also log everything to console
      {
        target: 'pino-pretty',
        level: 'debug',
        options: { colorize: true }
      }
    ]
  }
});
```

### 🌐 Express.js Integration

```javascript
const express = require('express');
const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      level: 'warn' // Only warnings and errors
    }
  }
});

const app = express();

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => {
  logger.info('🚀 Server started on port 3000');
});
```

### 🐳 Docker Container Logging

```javascript
// Perfect for containerized applications
const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      level: process.env.LOG_LEVEL || 'info'
    }
  }
});

// Container lifecycle events
process.on('SIGTERM', () => {
  logger.warn('📤 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  logger.fatal('💥 Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});
```

### 🔧 Custom Transport Stream

```javascript
const pino = require('pino');
const { createTelegramTransport } = require('pino-telegram');

// Create custom transport with advanced options
const telegramStream = createTelegramTransport({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
  level: 'error',
  parseMode: 'MarkdownV2',
  apiUrl: 'https://api.telegram.org' // Custom Telegram API URL
});

const logger = pino(telegramStream);

logger.error('Database connection failed', {
  database: 'postgresql',
  host: 'db.example.com',
  port: 5432,
  timeout: 5000
});
```

### 📊 Monitoring & Alerts

```javascript
const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      level: 'warn'
    }
  }
});

// Performance monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  if (memUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
    logger.warn('🔥 High memory usage', {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
    });
  }
}, 60000); // Check every minute

// Business metrics
function processPayment(amount, userId) {
  logger.info('💳 Payment processed', {
    amount: `$${amount}`,
    userId,
    timestamp: new Date().toISOString()
  });
}
```

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `botToken` | `string` | **required** | Telegram bot token from [@BotFather](https://t.me/botfather) |
| `chatId` | `string` | **required** | Chat ID where messages will be sent |
| `level` | `LogLevel` | `'info'` | Minimum log level: `trace`, `debug`, `info`, `warn`, `error`, `fatal` |
| `onlyLevels` | `LogLevel[]` | `undefined` | Send only these specific log levels (takes priority over `level`) |
| `excludeLevels` | `LogLevel[]` | `undefined` | Exclude these specific log levels from being sent |
| `parseMode` | `ParseMode` | `'HTML'` | Message format: `HTML`, `Markdown`, `MarkdownV2` |
| `includeTimestamp` | `boolean` | `false` | Include timestamp in messages (Telegram shows message time by default) |
| `apiUrl` | `string` | `'https://api.telegram.org'` | Telegram API URL (for custom instances) |

### 🎯 Advanced Log Filtering

The transport now supports precise log level filtering with three options that work together:

1. **`level`** - Traditional minimum level filtering (backward compatible)
2. **`onlyLevels`** - Send only specific log levels (exact matching)
3. **`excludeLevels`** - Exclude specific log levels from being sent

**Priority:** `onlyLevels` > `level` > `excludeLevels`

### 🎯 Multi-Channel Strategy

Perfect for organizing logs by severity across different Telegram channels as your application scales:

```javascript
// 🌟 RECOMMENDED: Severity-based channel organization
const logger = pino({
  transport: {
    targets: [
      // 🚨 Critical Issues - Immediate attention needed
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.CRITICAL_CHAT_ID,      // -1001111111111
          onlyLevels: ['fatal']
        }
      },
      
      // ❌ Error Logs - Development team monitoring  
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.ERROR_CHAT_ID,         // -1002222222222
          onlyLevels: ['error']
        }
      },
      
      // ⚠️ Warning Logs - Performance monitoring
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.WARNING_CHAT_ID,       // -1003333333333
          onlyLevels: ['warn']
        }
      },
      
      // ℹ️ Business Metrics - Product team insights
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.BUSINESS_CHAT_ID,      // -1004444444444
          onlyLevels: ['info']
        }
      }
    ]
  }
});

// Simple usage - automatic routing, no duplicates!
logger.info('🆕 New user registered');        // → Business channel
logger.warn('⚡ High CPU usage detected');    // → Warning channel
logger.error('🔌 Payment gateway timeout');   // → Error channel  
logger.fatal('💥 Database cluster failure');  // → Critical channel
```

**Benefits:**
- ✅ **No Duplicates** - Each log goes to exactly one channel
- ✅ **Team Focus** - Each team sees only relevant logs
- ✅ **Scalable** - Easy to add new channels as you grow
- ✅ **Simple Usage** - Developers just use standard `logger.info()`, `logger.warn()`, etc.

### 📊 Log Filtering Examples

#### **Traditional Min Level Filtering**
```javascript
// level: 'warn' - sends warn, error, fatal
logger.warn('⚠️ Warning message');    // ✅ Sent
logger.error('❌ Error message');     // ✅ Sent  
logger.fatal('💀 Fatal message');     // ✅ Sent

// These will NOT be sent
logger.info('ℹ️ Info message');       // ❌ Not sent
logger.debug('🐛 Debug message');     // ❌ Not sent
logger.trace('🔍 Trace message');     // ❌ Not sent
```

#### **Exact Level Matching with `onlyLevels`**
```javascript
// onlyLevels: ['error'] - sends ONLY errors
const errorLogger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.ERROR_CHAT_ID,
      onlyLevels: ['error']  // Only error messages
    }
  }
});

errorLogger.warn('⚠️ Warning');      // ❌ Not sent
errorLogger.error('❌ Error');       // ✅ Sent
errorLogger.fatal('💀 Fatal');       // ❌ Not sent
```

#### **Exclude Specific Levels with `excludeLevels`**
```javascript
// level: 'info' + excludeLevels: ['warn'] - sends info, error, fatal (but not warn)
const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.CHAT_ID,
      level: 'info',
      excludeLevels: ['warn']  // Exclude warnings
    }
  }
});

logger.info('ℹ️ Info message');      // ✅ Sent
logger.warn('⚠️ Warning');           // ❌ Not sent (excluded)
logger.error('❌ Error');            // ✅ Sent
logger.fatal('💀 Fatal');            // ✅ Sent
```

#### **Enable Timestamps (Optional)**
```javascript
// includeTimestamp: true - adds timestamps at the end of messages
const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.CHAT_ID,
      includeTimestamp: true  // Shows: [INFO] Message content\n2024-12-19T10:30:45.123Z
    }
  }
});
```

**Example with timestamp:**
```
[INFO] 🚀 Application started successfully!
2024-12-19T10:30:45.123Z
```

---

## 🎨 Message Formatting

### HTML Format (Default)
```javascript
// Produces rich formatted messages
logger.error('Database error', { 
  table: 'users', 
  operation: 'SELECT',
  error: new Error('Connection timeout')
});
```
**Result in Telegram:**
```
[ERROR] 2024-12-19T10:30:45.123Z
Database error

Error: Connection timeout
<stack trace here>

Context:
table: users
operation: SELECT
```

### Markdown Format
```javascript
const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: 'YOUR_TOKEN',
      chatId: 'YOUR_CHAT_ID',
      parseMode: 'Markdown'
    }
  }
});
```

---

## 🛠️ Advanced Features

### 🎯 Multiple Chat Destinations

#### **🚀 Recommended: Single Logger with Multiple Targets**
```javascript
// Single logger, multiple channels - BEST approach!
const logger = pino({
  transport: {
    targets: [
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.ERROR_CHAT_ID,
          onlyLevels: ['error', 'fatal']  // Only errors and fatal
        }
      },
      {
        target: 'pino-telegram', 
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.WARNING_CHAT_ID,
          onlyLevels: ['warn']  // Only warnings
        }
      },
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.INFO_CHAT_ID,
          onlyLevels: ['info']  // Only info messages
        }
      }
    ]
  }
});

// Now just use normal logging - no duplicates!
logger.info('User registered');     // → Goes to info channel only
logger.warn('High memory usage');   // → Goes to warning channel only  
logger.error('Database failed');    // → Goes to error channel only
```

#### **Alternative: Separate Loggers (Old approach)**
```javascript
// ⚠️ Can cause duplicates if not careful with levels
const errorLogger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TEAM_CHAT_ID,
      onlyLevels: ['error', 'fatal']  // Precise control
    }
  }
});

const businessLogger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.BUSINESS_CHAT_ID,
      onlyLevels: ['info']  // Only business events
    }
  }
});
```

### 📱 Environment-Based Configuration

```javascript
// .env file
// TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
// TELEGRAM_CHAT_ID=-1001234567890
// NODE_ENV=production
// LOG_LEVEL=warn

const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-telegram',
    options: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }
  }
});
```

### 🔄 Error Handling & Resilience

```javascript
const { createTelegramTransport } = require('pino-telegram');

// The transport handles errors gracefully
// Failed Telegram sends won't crash your app
const transport = createTelegramTransport({
  botToken: 'invalid-token', // Even with invalid credentials
  chatId: 'invalid-chat-id',
  level: 'error'
});

const logger = pino(transport);

// This won't crash your application
logger.error('This error will be logged locally even if Telegram fails');
```

---

## 🎉 Real-World Use Cases

### 🛒 E-commerce Application
```javascript
// Order processing
logger.info('📦 New order created', {
  orderId: 'ORD-12345',
  amount: '$99.99',
  customerId: 'CUST-789'
});

// Payment failures
logger.error('💳 Payment failed', {
  orderId: 'ORD-12345',
  paymentMethod: 'credit_card',
  errorCode: 'insufficient_funds'
});
```

### 🌐 API Monitoring
```javascript
// Track API performance
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 1000) { // Slow requests
      logger.warn('🐌 Slow API request', {
        method: req.method,
        path: req.path,
        duration: `${duration}ms`,
        statusCode: res.statusCode
      });
    }
    
    if (res.statusCode >= 400) { // Errors
      logger.error('❌ API error', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent')
      });
    }
  });
  
  next();
});
```

### 🔐 Security Monitoring
```javascript
// Failed login attempts
logger.warn('🔒 Failed login attempt', {
  email: 'user@example.com',
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  attempts: 3
});

// Suspicious activity
logger.error('🚨 Potential brute force attack', {
  ip: req.ip,
  attempts: 10,
  timeWindow: '5 minutes'
});
```

---

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import pino from 'pino';
import { 
  createTelegramTransport, 
  ITelegramTransportOptions, 
  LogLevel, 
  ParseMode 
} from 'pino-telegram';

// Type-safe configuration with new filtering options
const options: ITelegramTransportOptions = {
  botToken: process.env.TELEGRAM_BOT_TOKEN!,
  chatId: process.env.TELEGRAM_CHAT_ID!,
  level: 'warn',                        // LogLevel type
  onlyLevels: ['error', 'fatal'],       // LogLevel[] type  
  excludeLevels: ['debug'],             // LogLevel[] type
  parseMode: 'HTML'                     // ParseMode type
};

// Multi-channel setup with full type safety
const logger = pino({
  transport: {
    targets: [
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN!,
          chatId: process.env.ERROR_CHAT_ID!,
          onlyLevels: ['error'] as LogLevel[]  // Type-safe array
        } satisfies ITelegramTransportOptions
      },
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN!,
          chatId: process.env.INFO_CHAT_ID!,
          onlyLevels: ['info'] as LogLevel[]
        } satisfies ITelegramTransportOptions
      }
    ]
  }
});

// Full type safety and IntelliSense support
logger.info('TypeScript logging', { 
  userId: 123, 
  timestamp: new Date() 
});
```

---

## 🚀 Performance & Best Practices

### ⚡ Optimization Tips

1. **Use appropriate log levels** - Don't send debug logs to Telegram in production
2. **Filter sensitive data** - Never log passwords, API keys, or personal data  
3. **Batch similar logs** - Consider rate limiting for high-frequency events
4. **Use environment variables** - Keep tokens secure

### 📈 Smart Multi-Channel Monitoring

```javascript
// 🚀 BEST PRACTICE: Single logger with precise channel routing
const logger = pino({
  transport: {
    targets: [
      // 🔒 Security events - only warnings and errors
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.SECURITY_CHAT_ID,
          onlyLevels: ['warn', 'error']  // Precise security filtering
        }
      },
      
      // 💼 Business metrics - only info level
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.BUSINESS_CHAT_ID,
          onlyLevels: ['info']  // Only business events
        }
      },
      
      // 🚨 Critical alerts - only fatal errors
      {
        target: 'pino-telegram',
        options: {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.CRITICAL_CHAT_ID,
          onlyLevels: ['fatal']  // Only critical system failures
        }
      }
    ]
  }
});

// Usage - no duplicates, clear routing
logger.info('💳 Payment processed', { amount: 99.99 });     // → Business channel
logger.warn('🔒 Failed login attempt', { ip: '1.2.3.4' });  // → Security channel  
logger.fatal('💥 Database cluster down');                   // → Critical channel
```

---

## 🤝 Community & Support

### 📖 Documentation
- **[Pino Documentation](https://getpino.io)** - Learn more about Pino logging
- **[Telegram Bot API](https://core.telegram.org/bots/api)** - Official Telegram Bot documentation

### 🐛 Issues & Feature Requests
Found a bug or have a feature request? [Open an issue](https://github.com/JohnAdib/pino-telegram/issues) on GitHub!

### 💬 Community
- ⭐ **Star this repo** if you find it helpful!
- 🐦 **Follow [@MrAdib](https://twitter.com/MrAdib)** for updates
- 💬 **Join discussions** in GitHub Issues

---

## 📋 Requirements

- **Node.js** >= 20.0.0
- **Pino** >= 6.0.0
- **Telegram account** (free!)

---

## 📄 License

MIT © [MrAdib](https://github.com/JohnAdib)

---

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
```bash
git clone https://github.com/JohnAdib/pino-telegram.git
cd pino-telegram
npm install
npm run build
```

---

<div align="center">

**⭐ Star this repo if it helps you save money on logging! ⭐**

**Made with ❤️ by [MrAdib](https://github.com/JohnAdib)**

*Free logging for everyone! 🎉*

</div>