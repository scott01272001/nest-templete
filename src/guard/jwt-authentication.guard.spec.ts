import { TestingModule, Test } from '@nestjs/testing';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';

describe('JwtAuthenticationGuard', () => {

  let guard: JwtAuthenticationGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtService,
        UserService,
        Reflector
      ],
      providers: [
        JwtAuthenticationGuard
      ]
    }).compile();

    guard = module.get<JwtAuthenticationGuard>(JwtAuthenticationGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
