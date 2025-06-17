import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, body } = req;
    const userAgent = req.get('user-agent') ?? '';
    const start = Date.now();

    const safeBody: Record<string, unknown> =
      typeof body === 'object' && body !== null ? { ...body } : {};

    if (typeof safeBody.password === 'string') {
      safeBody.password = '******';
    }

    (
      res as Response & { on: (event: string, callback: () => void) => void }
    ).on('finish', () => {
      const { statusCode } = res;
      const elapsed = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${elapsed}ms - IP: ${ip} - UA: ${userAgent} - Body: ${JSON.stringify(
          safeBody,
        )}`,
      );
    });

    next();
  }
}
