import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenRequestDto, TokenResponseDto, GrantType } from './dto/token.dto';
import { BaseAuthPipe } from './pipe/base-auth.pipe';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Public } from '../../decorator/public-end-point.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Public()
    @ApiOperation({ summary: 'Get access token' })
    @ApiBody({ type: TokenRequestDto })
    @ApiResponse({
        status: 200,
        description: 'Token generated successfully',
        type: TokenResponseDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Post('oauth/token')
    async oauth(@Body(BaseAuthPipe) tokenRequest: TokenRequestDto): Promise<TokenResponseDto> {

        const resp = new TokenResponseDto();

        if (tokenRequest.grant_type === GrantType.PASSWORD) {
            // TODO: Validate username and password
            const accessToken = this.authService.createAccessToken(tokenRequest.username);
            resp.access_token = accessToken;
        } else if (tokenRequest.grant_type === GrantType.REFRESH_TOKEN) {
            const accessToken = await this.authService.refreshingAccessToken(tokenRequest.refresh_token);
            resp.access_token = accessToken;
        }

        const refreshToken = await this.authService.createRefreshToken();
        resp.refresh_token = refreshToken;
        resp.token_type = 'Bearer';
        resp.expires_in = Number(this.configService.get('auth.jwt.accessToken.expiresIn'));

        return resp;
    }
}
