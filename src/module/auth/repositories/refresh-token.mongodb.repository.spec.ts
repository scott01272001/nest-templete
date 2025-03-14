import { MongoMemoryServer } from "mongodb-memory-server";
import { RefreshTokenMongodbRepository } from "./refresh-token.mongodb.repository";
import { Connection, connect, Model } from "mongoose";
import { RefreshToken, RefreshTokenSchema } from "../schemas/refresh-token.schema";
import { Test } from "@nestjs/testing";
import { TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

describe('RefreshTokenMongodbRepository', () => {
    let repository: RefreshTokenMongodbRepository;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let refreshTokenModel: Model<RefreshToken>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        refreshTokenModel = mongoConnection.model<RefreshToken>(
            RefreshToken.name,
            RefreshTokenSchema
        );
    });

    afterAll(async () => {
        await mongoConnection.close();
        await mongod.stop();
    });

    beforeEach(async () => {
        await refreshTokenModel.deleteMany({});

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RefreshTokenMongodbRepository,
                {
                    provide: getModelToken(RefreshToken.name),
                    useValue: refreshTokenModel,
                },
            ],
        }).compile();

        repository = module.get<RefreshTokenMongodbRepository>(RefreshTokenMongodbRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a new refresh token', async () => {
            const refreshToken = {
                refreshToken: 'test-refresh-token',
                userId: 'test-user-id',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            }

            const createdRefreshToken = await repository.create(refreshToken);

            expect(createdRefreshToken).toBeDefined();
            expect((createdRefreshToken as any)._id).toBeDefined();
        });
    });

    describe('findByToken', () => {
        it('should find a refresh token by token', async () => {
            const refreshToken = {
                refreshToken: 'test-refresh-token',
                userId: 'test-user-id',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            }

            await repository.create(refreshToken);

            const foundRefreshToken = await repository.findByToken(refreshToken.refreshToken);

            expect(foundRefreshToken).toBeDefined();
            expect(foundRefreshToken?.refreshToken).toBe(refreshToken.refreshToken);
        })
    });

    describe('deleteById', () => {
        it('should delete a refresh token by id', async () => {
            const refreshToken = {
                refreshToken: 'test-refresh-token',
                userId: 'test-user-id',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            }

            const createdRefreshToken = await repository.create(refreshToken);
            await repository.deleteById((createdRefreshToken as any)._id);

            const foundRefreshToken = await repository.findByToken(refreshToken.refreshToken);

            expect(foundRefreshToken).toBeNull();
        })
    })

});
