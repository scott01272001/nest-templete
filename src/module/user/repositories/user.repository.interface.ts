import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
    findOneByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto, hashedPassword: string): Promise<User>;
} 