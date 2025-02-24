import { JwtAuthenticationGuard } from './jwt-authentication.guard';

describe('JwtAuthenticationGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthenticationGuard()).toBeDefined();
  });
});
