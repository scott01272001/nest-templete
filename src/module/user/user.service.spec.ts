import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER_REPOSITORY } from './repositories/user.repository.interface';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: USER_REPOSITORY,
                    useValue: {
                        findOneByEmail: jest.fn().mockResolvedValue({
                            email: "test@example.com",
                            password: "hashedPassword"
                        }),
                        create: jest.fn().mockResolvedValue({
                            email: "test-create@example.com",
                            password: "hashedPassword"
                        })
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

});
