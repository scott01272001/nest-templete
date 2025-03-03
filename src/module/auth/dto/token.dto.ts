import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GrantType {
    PASSWORD = 'password',
    REFRESH_TOKEN = 'refresh_token',
}

export class TokenRequestDto {
    @ApiProperty({
        enum: GrantType,
        description: 'Type of grant',
        example: GrantType.PASSWORD
    })
    @IsNotEmpty()
    @IsEnum(GrantType)
    grant_type: GrantType;

    @ApiProperty({
        description: 'Username for password grant type',
        required: false,
        example: 'john.doe'
    })
    @IsString()
    @IsOptional()
    username: string;

    @ApiProperty({
        description: 'Password for password grant type',
        required: false,
        example: 'password123'
    })
    @IsString()
    @IsOptional()
    password: string;

    @ApiProperty({
        description: 'Refresh token for refresh_token grant type',
        required: false
    })
    @IsString()
    @IsOptional()
    refresh_token: string;
}

export class TokenResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    access_token: string;

    @ApiProperty({
        description: 'JWT refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    refresh_token: string;

    @ApiProperty({
        description: 'Token type',
        example: 'Bearer'
    })
    token_type: string;

    @ApiProperty({
        description: 'Token expiration time in seconds',
        example: 3600
    })
    expires_in: number;
} 