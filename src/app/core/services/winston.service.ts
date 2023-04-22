/** @format */

import { LoggerService } from '@nestjs/common';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as logform from 'logform';

export class WinstonService implements LoggerService {
  loggerFormat = (): logform.Format => {
    return winston.format.printf((transformableInfo: winston.Logform.TransformableInfo) => {
      const { timestamp, level, ...info } = transformableInfo;

      return `${timestamp} [${level}]: ${JSON.stringify(info)}`;
    });
  };

  logger: winston.Logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.colorize({
            level: true,
            message: true
          }),
          winston.format.timestamp(),
          winston.format.printf((transformableInfo: winston.Logform.TransformableInfo) => {
            const { timestamp, level, message } = transformableInfo;

            return `${timestamp} [${level}]: ${message}`;
          })
        )
      }),
      new DailyRotateFile({
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(), this.loggerFormat()),
        filename: 'logs/info-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '1d'
      }),
      new DailyRotateFile({
        level: 'error',
        format: winston.format.combine(winston.format.timestamp(), this.loggerFormat()),
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '1d'
      })
    ]
  });

  log(message: any, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }
}
