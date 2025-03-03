import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from './user.repository.interface';

@Injectable()
export class UserMongodbRepository implements UserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    async create(createUserDto: CreateUserDto, hashedPassword: string): Promise<User> {
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword
        });

        return createdUser.save();
    }



} 