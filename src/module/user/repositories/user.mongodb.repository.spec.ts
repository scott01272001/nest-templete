import { Test, TestingModule } from '@nestjs/testing';
import { UserMongodbRepository } from './user.mongodb.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserQuery } from '../dto/user-query';

describe('UserMongodbRepository', () => {
    let repository: UserMongodbRepository;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let userModel: Model<User>;

    beforeAll(async () => {
        // Start in-memory MongoDB instance
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        userModel = mongoConnection.model(User.name, UserSchema);
    });

    afterAll(async () => {
        await mongoConnection.close();
        await mongod.stop();
    });

    beforeEach(async () => {
        // Clear collection before each test
        await userModel.deleteMany({});

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserMongodbRepository,
                {
                    provide: getModelToken(User.name),
                    useValue: userModel,
                },
            ],
        }).compile();

        repository = module.get<UserMongodbRepository>(UserMongodbRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            // Arrange
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123'
            };

            // Act
            const createdUser = await repository.create(createUserDto);

            // Assert
            expect(createdUser).toBeDefined();
            expect(createdUser.email).toBe(createUserDto.email);

            // Verify it's in the database
            const users = await userModel.find().exec();
            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(createUserDto.email);
        });
    });

    describe('findByEmail', () => {
        it('should find a user by email', async () => {
            // Arrange
            const email = 'test@example.com';
            const user = await userModel.create({
                email,
                password: 'password123',
            });

            // Act
            const foundUser = await repository.findOneByEmail(email);

            // Assert
            expect(foundUser).toBeDefined();
            if (foundUser) {
                expect(foundUser.email).toBe(email);
            } else {
                fail('User should be defined');
            }
        });

        it('should return null if no user with email exists', async () => {
            // Act
            const result = await repository.findOneByEmail('nonexistent@example.com');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return paginated users', async () => {
            // Arrange
            await userModel.create({ email: 'user1@example.com', password: 'password', isEmailVerified: true });
            await userModel.create({ email: 'user2@example.com', password: 'password', isEmailVerified: false });
            await userModel.create({ email: 'user3@example.com', password: 'password', isEmailVerified: false });

            const query: UserQuery = {
                isEmailVerified: false,
                page: 1,
                size: 10
            };

            const result = await repository.findAll(query);

            expect(result.data.length).toBe(2);
        });
    });

    describe('findById', () => {
        it('should find a user by id', async () => {
            // Arrange
            const user = await userModel.create({ email: 'user1@example.com', password: 'password', isEmailVerified: true });

            // Act
            const foundUser = await repository.findById(user._id.toString());

            // Assert
            expect(foundUser).toBeDefined();
            expect(foundUser?.email).toBe(user.email);
        });
    });
});
