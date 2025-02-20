import { RemovePasswordItcInterceptor } from './remove-password-itc.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

describe('RemovePasswordItcInterceptor', () => {
  let interceptor: RemovePasswordItcInterceptor;
  let mockCallHandler: CallHandler;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    interceptor = new RemovePasswordItcInterceptor();
    mockCallHandler = {
      handle: jest.fn()
    };
    mockExecutionContext = {} as ExecutionContext;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should remove password from single object', async () => {
    const user = {
      username: 'testuser',
      password: 'testpassword',
      email: 'test@test.com'
    };

    mockCallHandler.handle = jest.fn().mockReturnValue(of(user));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler)
    );

    expect(result).toEqual({
      username: 'testuser',
      email: 'test@test.com'
    });
    expect(result.password).toBeUndefined();
  });

  it('should remove password from nested object', async () => {
    const user = {
      data: {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@test.com'
      }
    };

    mockCallHandler.handle = jest.fn().mockReturnValue(of(user));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler)
    );

    expect(result).toEqual({
      data: {
        username: 'testuser',
        email: 'test@test.com'
      }
    });
    expect(result.password).toBeUndefined();

  });


});
