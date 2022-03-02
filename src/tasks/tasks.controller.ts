import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async addTask(
    @Body('title') title: string,
    @Body('project_id') project_id: string,
    @Body('assigned_users') assigned_users: string[],
    @Body('project_manager_id') project_manager_id: string,
    @Body('sub_tasks') sub_tasks: string[],
    @Body('status') status: string,
    @Body('description') description: string,
    @Body('created_by') created_by: string,
    @Body('creation_time') creation_time: Date,
  ) {
    const result = await this.tasksService.insertTask(
      title,
      project_id,
      assigned_users,
      project_manager_id,
      sub_tasks,
      status,
      description,
      created_by,
      creation_time,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleTasks') multipleTasks: any) {
    const tasks = await this.tasksService.insertBulkTasks(multipleTasks);
    return tasks;
  }

  @Get()
  async getAllTasks(@Request() req) {
    console.log('getAllTasks');
    const tasks = await this.tasksService.getTasks(5);
    return tasks;
  }

  @Get(':id')
  getTaskSingle(@Param('id') id: string) {
    return this.tasksService.getSingleTask(id, 5);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('project_id') project_id: string,
    @Body('assigned_users') assigned_users: string[],
    @Body('project_manager_id') project_manager_id: string,
    @Body('sub_tasks') sub_tasks: string[],
    @Body('status') status: string,
    @Body('description') description: string,
    @Body('created_by') created_by: string,
    @Body('creation_time') creation_time: Date,
  ) {
    console.log(id, '==id');
    const result = await this.tasksService.updateTask(
      id,
      title,
      project_id,
      assigned_users,
      project_manager_id,
      sub_tasks,
      status,
      description,
      created_by,
      creation_time,
    );
    return result;
  }

  @Delete(':id')
  async removeTask(@Param('id') id: string) {
    const result = await this.tasksService.deleteTask(id);
    return result;
  }
}
