import { TestingModule, Test } from '@nestjs/testing';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../module/user/user.service';
import { Reflector } from '@nestjs/core';

describe('JwtAuthenticationGuard', () => {

  let guard: JwtAuthenticationGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
        })
      ],
      providers: [
        JwtAuthenticationGuard,
        Reflector,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({
              email: 'test@example.com',
              password: 'hashedPassword'
            })
          }
        }
      ]
    }).compile();

    guard = module.get<JwtAuthenticationGuard>(JwtAuthenticationGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
