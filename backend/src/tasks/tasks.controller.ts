import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO, TaskDTO, TaskFilterDTO } from '@shared/index';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Request() req: { user: { id: string } },
    @Body() createTaskDto: CreateTaskDTO,
  ) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req: { user: { id: string } },
    @Query() filter: TaskFilterDTO,
  ) {
    return this.tasksService.findAll(req.user.id, filter);
  }

  @Get('stats')
  getStats(@Request() req: { user: { id: string } }) {
    return this.tasksService.getStats(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateTaskDto: Partial<TaskDTO>,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
