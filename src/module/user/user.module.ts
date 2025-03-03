import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMongodbRepository } from './repositories/user.mongodb.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [
        UserService,
        {
            provide: USER_REPOSITORY,
            useClass: UserMongodbRepository
        }
    ],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }
