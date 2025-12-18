import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDTO, TaskDTO, Priority, TaskFilterDTO, TaskStatsDTO } from '@shared/index';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) { }

  async create(createTaskDto: CreateTaskDTO, userId: string): Promise<TaskDTO> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
    return {
      ...task,
      description: task.description ?? undefined,
      priority: task.priority as unknown as Priority
    };
  }

  async findAll(userId: string, filter?: TaskFilterDTO): Promise<TaskDTO[]> {
    const { search, priority, completed, sortBy, sortOrder } = filter || {};

    const where: any = { userId };
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (priority) {
      where.priority = priority;
    }
    if (completed !== undefined) {
      // Handle string boolean conversion if coming from query params without transformation
      const isCompleted = String(completed) === 'true';
      where.completed = isCompleted;
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy,
    });
    return tasks.map(t => ({
      ...t,
      description: t.description ?? undefined,
      priority: t.priority as unknown as Priority
    }));
  }

  async getStats(userId: string): Promise<TaskStatsDTO> {
    const totalTasks = await this.prisma.task.count({ where: { userId } });
    const completedTasks = await this.prisma.task.count({ where: { userId, completed: true } });

    const priorityGroups = await this.prisma.task.groupBy({
      by: ['priority'],
      where: { userId },
      _count: { priority: true },
    });

    const tasksByPriority = {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    priorityGroups.forEach(group => {
      // Cast group.priority to string/enum key if needed, Prisma generated enums match
      const key = group.priority as unknown as keyof typeof tasksByPriority;
      if (tasksByPriority[key] !== undefined) {
        tasksByPriority[key] = group._count.priority;
      }
    });

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) : 0,
      tasksByPriority,
    };
  }

  async findOne(id: string, userId: string) {
    return this.prisma.task.findFirst({
      where: { id, userId }
    });
  }

  async update(id: string, updateTaskDto: Partial<TaskDTO>, userId: string) {
    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    if (task) {
      // Explicitly select pushToken or cast
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });
      // Prisma types might not be updated in IDE context yet, cast to any or check manually
      const pushToken = (user as any)?.pushToken;

      if (pushToken) {
        await this.notificationsService.sendPushNotification(
          pushToken,
          `Task Updated: ${task.title}`,
          { taskId: task.id }
        );
      }
    }
    return { ...task, description: task.description ?? undefined };
  }

  async remove(id: string, userId: string) {
    return this.prisma.task.delete({
      where: { id }
    });
  }
}
