import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
        }),
      ],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('1h'), // Mock implementation
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccessToken', () => {
    it('should create an access token with the correct payload', () => {
      const username = 'testuser';
      const token = service.createAccessToken(username);
      const decoded = jwtService.verify(token);

      expect(decoded).toMatchObject({
        username: 'testuser',
        sub: 1,
      });
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token with the correct structure', () => {
      const token = service.createRefreshToken();
      const decoded = jwtService.verify(token);
      expect(decoded).toHaveProperty('token');
      expect(decoded).toHaveProperty('token_type', 'refresh_token');
      expect(decoded.token).not.toBe('');
    });
  });

  describe('refreshingAccessToken', () => {
    it('should create a new access token from a valid refresh token', () => {
      const refreshToken = service.createRefreshToken();
      const createAccessTokenSpy = jest.spyOn(service, 'createAccessToken');
      const newAccessToken = service.refreshingAccessToken(refreshToken);
      const decoded = jwtService.verify(newAccessToken);
      expect(decoded).toHaveProperty('sub', 1);
      expect(createAccessTokenSpy).toHaveBeenCalled();
    });

    it('should throw an error for invalid refresh token', () => {
      expect(() => {
        service.refreshingAccessToken('invalid-token');
      }).toThrow();
    });
  });
});
