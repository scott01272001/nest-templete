import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TokenRequestDto, GrantType } from '../dto/token.dto';

@Injectable()
export class AuthPipe implements PipeTransform {

  transform(value: TokenRequestDto, metadata: ArgumentMetadata) {
    if (value.grant_type === GrantType.PASSWORD) {
      if (!value.username || !value.password) {
        throw new BadRequestException('Username and password are required for password grant type');
      }
    }
    return value;
  }

}
