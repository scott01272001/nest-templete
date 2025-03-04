import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from './user.repository.interface';
import { PageResponse } from 'src/common/dto/PaginationDto';
import { UserQuery } from '../dto/user-query';

@Injectable()
export class UserMongodbRepository implements UserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel({
            ...createUserDto
        });

        return createdUser.save();
    }

    async findAll(query: UserQuery): Promise<PageResponse<User>> {
        const { isEmailVerified, isActive, roles } = query;
        const queryBuilder = this.userModel.find();

        if (isEmailVerified !== undefined) {
            queryBuilder.where('isEmailVerified', isEmailVerified);
        }

        if (isActive !== undefined) {
            queryBuilder.where('isActive', isActive);
        }

        if (roles && roles.length > 0) {
            queryBuilder.where('roles', { $in: roles });
        }

        queryBuilder.skip((query.page - 1) * query.size).limit(query.size);

        const [users, total] = await Promise.all([
            queryBuilder.exec(),
            this.userModel.countDocuments(queryBuilder.getQuery())
        ]);

        return {
            data: users,
            pagination: {
                total,
                page: query.page,
                size: query.size,
                count: users.length
            }
        };
    }

} 