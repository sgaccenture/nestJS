import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TasksRepository]),
        AuthModule,
        ConfigModule,
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule { }
