import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Logger,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private readonly _logger = new Logger('/tasks', true);
    constructor(private _tasksService: TasksService) { }

    // if 404 for the route - remove dist & restart start:dev

    @Get()
    @HttpCode(200)
    public async findAll(
        @Query() filterDto: GetTaskFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this._logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto, null, 4)}`, `GET '/'`);
        return await this._tasksService.findAll(filterDto, user);
    }

    @Get('/:id')
    @HttpCode(200)
    @HttpCode(404)
    public async findOne(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<Task> {
        return await this._tasksService.findOne(id, user);
    }

    @Post()
    @HttpCode(201)
    public async create(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return await this._tasksService.create(createTaskDto, user);
    }

    // Note - cannot use DTO fro Param & Body at once
    @Patch('/:id/status')
    @HttpCode(200)
    public async updateStatus(
        @Param('id') id: string,
        @Body('status') updateTaskStatusDto: UpdateTaskStatusDto,
        @GetUser() user: User) {
        const { status } = updateTaskStatusDto;
        return await this._tasksService.updateStatus(id, status, user);
    }

    @Delete('/:id')
    @HttpCode(204)
    @HttpCode(404)
    async remove(
        @Param('id') id: string,
        @GetUser() user: User): Promise<void> {
        return await this._tasksService.removeOne(id, user);
    }
}
