import { GrantType } from '../dto/token.dto';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { BaseAuthPipe } from './base-auth.pipe';
import { TokenRequestDto } from '../dto/token.dto';

describe('BaseAuthPipe', () => {
  let pipe: BaseAuthPipe;

  beforeEach(() => {
    pipe = new BaseAuthPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform a valid value', async () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TokenRequestDto,
      data: 'body',
    };

    const value = new TokenRequestDto();
    value.grant_type = GrantType.PASSWORD;
    value.username = 'testuser';
    value.password = 'testpassword';
    const result = pipe.transform(value, metadata);
    expect(result).toEqual(value);
  });

  it('should throw a BadRequestException for an invalid value', async () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TokenRequestDto,
      data: 'body',
    };

    const value = new TokenRequestDto();
    value.grant_type = GrantType.PASSWORD;
    value.username = 'testuser';
    value.password = '';
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });
});
