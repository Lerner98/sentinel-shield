export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, context));

    // In production, you would send errors to a logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(message, context);
    }
  }

  private async sendToLoggingService(
    message: string,
    context?: LogContext
  ): Promise<void> {
    // Implement your logging service integration here
    // Examples: Sentry, LogRocket, Datadog, etc.
    try {
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   body: JSON.stringify({ message, context, timestamp: new Date() })
      // });
    } catch (error) {
      console.error("Failed to send log to service:", error);
    }
  }
}

export const logger = new Logger();
