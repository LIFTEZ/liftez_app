import { consoleTransport, logger as rnLogger } from 'react-native-logs';

// Config options (customize as needed)
const log = rnLogger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? 'debug' : 'error', // Debug in dev, only errors in prod
  transport: consoleTransport, // Output to console (add file transport later if needed)
  transportOptions: {
    colors: {
      debug: 'blue',
      info: 'green',
      warn: 'yellow',
      error: 'red',
    },
    extensionColors: { // Optional: Color by namespace if using extend
      http: 'cyan',
      db: 'magenta',
    },
  },
  async: true, // Async logging to avoid blocking UI
  dateFormat: 'time', // Add timestamps (options: 'time', 'local', 'utc', 'iso')
  printLevel: true, // Prefix logs with level (e.g., [DEBUG])
  printDate: true, // Include date/time
  enabled: true,
});

// Create and export the logger instance


// Example usage (you can remove this—it's for testing)
// logger.debug('Debug message');
// logger.info('Info message');
// logger.warn('Warn message');
// logger.error('Error message');

// For namespaced loggers (optional, e.g., for different modules)
// const httpLogger = logger.extend('http');
// httpLogger.info('HTTP request sent');

export default log;