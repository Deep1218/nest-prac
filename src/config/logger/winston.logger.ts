import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import { LoggerMiddleware } from './logger.middleware';

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    // Create a winston logger instance
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ level, message, timestamp, context }) => {
          // Create a Date object
          const date = new Date(timestamp as string);

          // Format options
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          };

          // Format the date
          const formattedDate = new Intl.DateTimeFormat(
            'en-US',
            options,
          ).format(date);
          const requestId = LoggerMiddleware.getRequestId() ?? '';
          const logContent = `${formattedDate}  ${level.toUpperCase()} ${message} ${context}`;
          return requestId
            ? `[custom] ${requestId} - ${logContent}`
            : `[custom] - ${logContent}`;
        }),
      ),
      transports: [
        new transports.Console(), // Logs to the console
      ],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, context?: string, trace?: string) {
    this.logger.error(message, {
      trace,
      context,
    });
  }

  warn(message: any, context: string = '') {
    this.logger.warn(message, { context });
  }

  debug(message: any, context: string = '') {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context: string = '') {
    this.logger.verbose(message, { context });
  }
}
