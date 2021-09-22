import { Task } from '../../tasks/entities/task.entity';

export interface IUser {
    id: string;
    username: string;
    password: string;
    tasks: Array<Task>;
}