/**
 * Centralized logging service
 *
 * In production, this should be connected to a service like Sentry, LogRocket, or DataDog.
 * For now, it provides a consistent interface and development logging.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: any
}

class LoggerService {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '')
    }
    // In production: Send to logging service
    this.sendToExternalService('info', message, context)
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '')
    }
    // In production: Send to logging service
    this.sendToExternalService('warn', message, context)
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error, context || '')
    }
    // In production: Send to error tracking service (e.g., Sentry)
    this.sendToExternalService('error', message, { ...context, error })
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '')
    }
  }

  /**
   * Send logs to external service in production
   * TODO: Implement actual integration with Sentry, LogRocket, etc.
   */
  private sendToExternalService(_level: LogLevel, _message: string, _context?: LogContext): void {
    if (!this.isDevelopment) {
      // TODO: Integrate with production logging service
      // Example for Sentry:
      // if (_level === 'error') {
      //   Sentry.captureException(new Error(_message), { extra: _context })
      // } else {
      //   Sentry.captureMessage(_message, { level: _level, extra: _context })
      // }
    }
  }
}

export const logger = new LoggerService()
