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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
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
    @Body('due_date') due_date: Date,
    @Body('approved') approved: boolean,
    @Body('approved_by') approved_by: string,
    @Body('time_approved') time_approved: Date,
    @Body('time_sent_to_review') time_sent_to_review: Date,
    @Body('still_visible_to_worker') still_visible_to_worker: Boolean,
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
      due_date,
      approved,
      approved_by,
      time_approved,
      time_sent_to_review,
      still_visible_to_worker,
    );
    return { _id: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/multiple')
  async addMultiple(@Body('multipleTasks') multipleTasks: any) {
    const tasks = await this.tasksService.insertBulkTasks(multipleTasks);
    return tasks;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTasks(@Request() req) {
    const tasks = await this.tasksService.getTasks(5);
    return tasks;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  getTaskSingle(@Param('_id') _id: string) {
    return this.tasksService.getSingleTask(_id, 5);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:_id')
  async getTasksPerUser(@Param('_id') _id: string) {
    const tasks = await this.tasksService.getTasksPerUserId(_id);
    return tasks;
  }

  // @Get('project/:_id')
  // async getProjectByTaskId(@Param('_id') _id: string) {
  //   const tasks = await this.tasksService.getProjectByTaskId(_id);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('project/:_id')
  async getTasksPerProjectId(@Param('_id') _id: string) {
    const tasks = await this.tasksService.getTasksPerProjectId(_id);
    return tasks;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  async updateTask(
    @Param('_id') _id: string,
    @Body('title') title: string,
    @Body('project_id') project_id: string,
    @Body('assigned_users') assigned_users: string[],
    @Body('project_manager_id') project_manager_id: string,
    @Body('sub_tasks') sub_tasks: string[],
    @Body('status') status: string,
    @Body('description') description: string,
    @Body('created_by') created_by: string,
    @Body('creation_time') creation_time: Date,
    @Body('due_date') due_date: Date,
    @Body('approved') approved: boolean,
    @Body('approved_by') approved_by: string,
    @Body('time_approved') time_approved: Date,
    @Body('time_sent_to_review') time_sent_to_review: Date,
    @Body('still_visible_to_worker') still_visible_to_worker: Boolean,
  ) {
    const result = await this.tasksService.updateTask(
      _id,
      title,
      project_id,
      assigned_users,
      project_manager_id,
      sub_tasks,
      status,
      description,
      created_by,
      creation_time,
      due_date,
      approved,
      approved_by,
      time_approved,
      time_sent_to_review,
      still_visible_to_worker,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async removeTask(@Param('_id') _id: string) {
    const result = await this.tasksService.deleteTask(_id);
    return result;
  }
}
