import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTask(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks
    }


    async createTask(creatTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = creatTaskDto;

        const task = new Task;
        task.title = title;
        task.description = description;
        task.status = TaskStatus.DONE;

        await task.save()

        return task;
    }
}