import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTask(
        filterDto: GetTaskFilterDto,
        user: User,
    ): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks
    }


    async createTask(
        creatTaskDto: CreateTaskDto,
        user: User,
    ): Promise<Task> {
        const { title, description } = creatTaskDto;

        const task = new Task;
        task.title = title;
        task.description = description;
        task.status = TaskStatus.DONE;
        task.user = user;

        await task.save()

        delete task.user;

        return task;
    }
}