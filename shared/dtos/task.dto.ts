import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum Priority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
}

export class TaskDTO {
    id!: string;
    title!: string;
    description?: string;
    completed!: boolean;
    priority!: Priority;
    userId!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export class CreateTaskDTO {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;
}

export class TaskFilterDTO {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    completed?: boolean | string;

    @IsOptional()
    sortBy?: 'createdAt' | 'priority';

    @IsOptional()
    sortOrder?: 'asc' | 'desc';
}

export class TaskStatsDTO {
    totalTasks!: number;
    completedTasks!: number;
    completionRate!: number;
    tasksByPriority!: {
        HIGH: number;
        MEDIUM: number;
        LOW: number;
    };
}
