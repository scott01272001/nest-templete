import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { REFRESH_TOKEN_REPOSITORY, RefreshTokenRepository } from './repositories/refresh-token.repository.interface';
import { UserRepository } from '../user/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../user/repositories/user.repository.interface';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(REFRESH_TOKEN_REPOSITORY) private refreshTokenRepository: RefreshTokenRepository,
        @Inject(USER_REPOSITORY) private userRepository: UserRepository
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

    async refreshingAccessToken(refreshToken: string) {
        const existingRefreshToken = await this.refreshTokenRepository.findByToken(refreshToken);
        if (!existingRefreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const userId = existingRefreshToken.userId;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const accessToken = this.createAccessToken(user.email);
        const newRefreshToken = this.createRefreshToken();

        const refreshTokenId = (existingRefreshToken as any)._id
        this.refreshTokenRepository.update(refreshTokenId, newRefreshToken);

        return this.createAccessToken(user.email);
    }

}
