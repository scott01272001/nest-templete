import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PageRequest {
    @ApiProperty({
        description: 'Page number (zero-based)',
        default: 0,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    size: number;
}

export class Pagination {
    @ApiProperty({
        description: 'Current page number (zero-based)',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    page?: number;

    @ApiProperty({
        description: 'Number of items per page',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    size?: number;

    @ApiProperty({
        description: 'Number of items on the current page',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    count?: number;

    @ApiProperty({
        description: 'Total number of items across all pages',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    total?: number;
}

export class PageResponse<T> {
    @ApiProperty({
        description: 'List of data items for the current page',
        isArray: true,
    })
    data: T[];

    @ApiProperty({
        description: 'Pagination information',
        type: Pagination,
    })
    pagination: Pagination;
}