import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/entities/user.entity';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksService } from './tasks.service';

const mockRepository = () => ({
    findAll: jest.fn()
});

const mockUser: User = {
    id: 'id',
    username: 'Name',
    password: '12312312',
    tasks: []
}

describe('TasksService', () => {
    let service: TasksService;
    let repository: TasksRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository,
                    useFactory: mockRepository
                }
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        repository = module.get<TasksRepository>(TasksRepository);
    });
    // todo: https://stackoverflow.com/questions/55366037/inject-typeorm-repository-into-nestjs-service-for-mock-data-testing/55366343#55366343
    describe('findAll', () => {
        it.only('calls tasks repository findAll and returns Tasks', async () => {
            repository.findAll.mockReturnValue('someValue')
            const res = service.findAll(null, mockUser);
            expect(res).toEqual('someValue');
        });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
