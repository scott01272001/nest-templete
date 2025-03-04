import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository, USER_REPOSITORY } from './repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { UserQuery } from './dto/user-query';
import { PageResponse } from 'src/common/dto/PaginationDto';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private userRepository: UserRepository
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOneByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPassword;

        // Create new user
        return this.userRepository.create(createUserDto);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findAll(query: UserQuery): Promise<PageResponse<User>> {
        return this.userRepository.findAll(query);
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
} 