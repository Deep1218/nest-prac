import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger();
const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID();
    req['requestId'] = requestId;

    const store = new Map<string, any>();
    store.set('requestId', requestId);
    asyncLocalStorage.run(store, () => {
      logger.log(
        `Request started: ${req.method} ${req.url}`,
        JSON.stringify({ Pramas: req.params, Query: req.query }),
      );
      res.on('finish', () => {
        logger.log(`Request completed: ${req.method} ${req.url}`);
      });
      next();
    });
  }

  static getRequestId(): string | undefined {
    const store = asyncLocalStorage.getStore();
    return store?.get('requestId');
  }
}
