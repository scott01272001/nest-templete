import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({
        description: 'Refresh token',
        example: '1234567890'
    })
    @IsNotEmpty()
    @IsString()
    refresh_token: string;
}