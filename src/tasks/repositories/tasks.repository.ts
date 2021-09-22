import { User } from '../../auth/entities/user.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { GetTaskFilterDto } from '../dto/get-tasks-filter.dto';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../models/task.model';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    private readonly _logger = new Logger('TasksRepository', true);
    public async findAll(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });
        if (status) {
            query.andWhere('task.status = :status', { status: TaskStatus.OPEN })
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { // () around is to fix the bug and treat the whole query as one query
                search: `%${search}%`
            })
        }
        const tasks = await query.getMany();
        return tasks;
    }

    public async findOneById(id: string, user: User): Promise<Task> {
        return await this.findOne({ where: { id, user } });
        // OR this.findOne({ id, user });
    }

    public async createOne(task: Task): Promise<Task> {
        const t = await this.create(task);
        return await this.save(t);
    }

    public async updateOne(task: Task): Promise<Task> {
        return await this.save(task);
    }

    public async removeOne(id: string, user: User): Promise<DeleteResult> {
        return await this.delete({ id, user });
    }

}
