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
      handle: jest.fn(),
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
      email: 'test@test.com',
    };

    mockCallHandler.handle = jest.fn().mockReturnValue(of(user));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      username: 'testuser',
      email: 'test@test.com',
    });
    expect(result.password).toBeUndefined();
  });

  it('should remove password from nested object', async () => {
    const user = {
      data: {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@test.com',
      },
    };

    mockCallHandler.handle = jest.fn().mockReturnValue(of(user));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      data: {
        username: 'testuser',
        email: 'test@test.com',
      },
    });
    expect(result.password).toBeUndefined();
  });

  it('should remove password from array of objects', async () => {
    const users = [
      {
        username: 'user1',
        password: 'pass1',
        email: 'user1@test.com',
      },
      {
        username: 'user2',
        password: 'pass2',
        email: 'user2@test.com',
      },
    ];

    mockCallHandler.handle = jest.fn().mockReturnValue(of(users));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual([
      {
        username: 'user1',
        email: 'user1@test.com',
      },
      {
        username: 'user2',
        email: 'user2@test.com',
      },
    ]);
    expect(result[0].password).toBeUndefined();
    expect(result[1].password).toBeUndefined();
  });

  it('should remove password from deeply nested objects', async () => {
    const data = {
      user: {
        profile: {
          username: 'testuser',
          password: 'secret',
          details: {
            password: 'another-secret',
            info: 'some-info',
          },
        },
        settings: {
          password: 'setting-password',
          theme: 'dark',
        },
      },
    };

    mockCallHandler.handle = jest.fn().mockReturnValue(of(data));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      user: {
        profile: {
          username: 'testuser',
          details: {
            info: 'some-info',
          },
        },
        settings: {
          theme: 'dark',
        },
      },
    });
  });

  it('should handle null and undefined values', async () => {
    const data = {
      user: null,
      profile: undefined,
      settings: {
        password: 'secret',
        theme: 'light',
      },
    };

    mockCallHandler.handle = jest.fn().mockReturnValue(of(data));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      settings: {
        theme: 'light',
      },
    });
  });

  it('should handle mixed array with objects and primitives', async () => {
    const data = {
      items: [
        'string',
        123,
        { password: 'secret', data: 'value' },
        [{ nested: { password: 'hidden' } }],
      ],
    };

    mockCallHandler.handle = jest.fn().mockReturnValue(of(data));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      items: ['string', 123, { data: 'value' }, [{ nested: {} }]],
    });
  });
});
