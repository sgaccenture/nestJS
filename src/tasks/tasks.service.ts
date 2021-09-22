import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './models/task.model';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './repositories/tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TasksRepository) private _tasksRepository: TasksRepository) {

    }

    public async findAll(dto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return await this._tasksRepository.findAll(dto, user);
    }

    public async findOne(id: string, user: User): Promise<Task> {
        const found = await this._tasksRepository.findOneById(id, user);
        if (!found) throw new NotFoundException(`Task with ${id} wasn't found`);
        return found;
    }

    public async create(dto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = dto;
        const task = {
            title,
            description,
            status: TaskStatus.OPEN,
            user
        };
        return await this._tasksRepository.createOne(task as Task);
    }

    public async updateStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this._tasksRepository.findOneById(id, user);
        task.status = status;
        // TODO: https://typeorm.io/#/update-query-builder
        return await this._tasksRepository.updateOne(task);
    }

    public async removeOne(id: string, user): Promise<void> {
        const { affected } = await this._tasksRepository.removeOne(id, user);
        if (!affected) throw new NotFoundException(`Task with ${id} wasn't found`);
        return;
    }
}
