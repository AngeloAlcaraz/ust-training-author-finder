import { AllExceptionsFilter } from '../../../src/common/filters/all-exceptions.filter'
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/test' }),
      }),
      getType: () => 'http',
    } as any;

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Forbidden',
        path: '/test',
      }),
    );
  });

  it('should handle non-HttpException as 500 error', () => {
    const exception = new Error('Unexpected error');

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/test' }),
      }),
      getType: () => 'http',
    } as any;

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Internal server error',
        path: '/test',
      }),
    );
  });
});
