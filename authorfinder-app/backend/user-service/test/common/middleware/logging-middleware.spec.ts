import { LoggingMiddleware } from '../../../src/common/middleware/logging-middleware';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let mockLoggerLog: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggingMiddleware();
    mockLoggerLog = jest.spyOn(middleware['logger'], 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call next()', () => {
    const req: any = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      body: {},
      get: jest.fn().mockReturnValue('jest-user-agent'),
    };
    const res: any = {
      on: jest.fn((event, cb) => {
        if (event === 'finish') cb();
      }),
      statusCode: 200,
    };
    const next = jest.fn();

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
    const req: any = {
      method: 'POST',
      originalUrl: '/login',
      ip: '192.168.1.1',
      body: { username: 'user', password: 'secret' },
      get: jest.fn().mockReturnValue('test-agent'),
    };
    const res: any = {
      on: jest.fn((event, cb) => {
        if (event === 'finish') cb();
      }),
      statusCode: 201,
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();

    // Check that password is masked in the log
    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('"password":"******"'),
    );
    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('"username":"user"'),
    );
  });
});
