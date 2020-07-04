import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }


    async getTaskByid(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }

        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected == 0) {
            throw new NotFoundException(`This with id "${id} not found"`)
        }

    }
    async updateTaskStatus(id: number, status: TaskStatus, updateDto: CreateTaskDto): Promise<Task> {
        const { title, description } = updateDto;
        const task = await this.getTaskByid(id);
        task.status = status;
        task.title = title;
        task.description = description;
        await task.save()

        return task;
    }

    async getTask(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTask(filterDto, user);

    }

}
