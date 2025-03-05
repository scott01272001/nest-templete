import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsString } from "class-validator";
import { PageRequest } from "src/common/dto/pagination";

export class UserQuery extends PageRequest {

    @ApiProperty({
        description: 'Is email verified',
        default: false,
    })
    @IsBoolean()
    isEmailVerified?: boolean;

    @ApiProperty({
        description: 'Is active',
        default: false,
    })
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({
        description: 'Roles',
        default: [],
    })
    @IsArray()
    @IsString({ each: true })
    roles?: string[];

}