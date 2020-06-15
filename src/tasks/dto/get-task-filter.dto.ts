import { TaskStatus } from "../task-status.enum";
import { IsOptional, IsEmpty, IsIn } from "class-validator";

export class GetTaskFilterDto {

    @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
    status: TaskStatus;

    @IsOptional()
    @IsEmpty()
    search: string;
}