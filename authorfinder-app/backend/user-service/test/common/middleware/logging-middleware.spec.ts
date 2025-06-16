import { Request, Response, NextFunction } from 'express';
import { LoggingMiddleware } from '../../../src/common/middleware/logging-middleware';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let mockLoggerLog: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggingMiddleware();
    mockLoggerLog = jest
      .spyOn(middleware['logger'], 'log')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call next()', () => {
    const req = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      body: {},
      get: jest.fn().mockReturnValue('jest-user-agent'),
    } as unknown as Request;

    const res = {
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') cb();
      }),
      statusCode: 200,
    } as unknown as Response & { on: (event: string, cb: () => void) => void };

    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 200 -'),
    );
    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('IP: 127.0.0.1'),
    );
    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('UA: jest-user-agent'),
    );
  });

  it('should mask password in logged body', () => {
    const req = {
      method: 'POST',
      originalUrl: '/login',
      ip: '192.168.1.1',
      body: { username: 'user', password: 'secret' },
      get: jest.fn().mockReturnValue('test-agent'),
    } as unknown as Request;

    const res = {
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') cb();
      }),
      statusCode: 201,
    } as unknown as Response & { on: (event: string, cb: () => void) => void };

    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();

    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('"password":"******"'),
    );
    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('"username":"user"'),
    );
  });
});
