import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    createAccessToken(username: string) {
        const payload = { username, sub: 1 };
        return this.jwtService.sign(payload);
    }

    createRefreshToken() {
        const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        const payload = { token, token_type: 'refresh_token' };

        return this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
        });
    }

    refreshingAccessToken(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken);
        return this.createAccessToken(payload.username);
    }

}
