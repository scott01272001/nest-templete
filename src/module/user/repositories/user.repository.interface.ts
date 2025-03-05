import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserQuery } from '../dto/user-query';
import { PageResponse } from 'src/common/dto/pagination';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
    findOneByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(query: UserQuery): Promise<PageResponse<User>>;
} 