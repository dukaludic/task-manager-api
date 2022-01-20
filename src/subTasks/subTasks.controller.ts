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

import { SubTasksService } from './subTasks.service';

@Controller('subtasks')
export class SubTasksController {
  constructor(private readonly subTasksService: SubTasksService) {}

  @Post()
  async addSubTask(
    @Body('task_id') task_id: string,
    @Body('content') content: string,
    @Body('status') status: boolean,
  ) {
    const result = await this.subTasksService.insertSubTask(
      task_id,
      content,
      status,
    );
    return { id: result };
  }

  // @Post('/multiple')
  // async addMultiple(@Body('multipleSubTasks') multipleSubTasks: any) {
  //   const subTasks = await this.subTasksService.insertBulkSubTasks(multipleSubTasks);
  //   return subTasks;
  // }

  @Get()
  async getAllSubTasks(@Request() req) {
    console.log('getAllSubTasks');
    const subTasks = await this.subTasksService.getSubTasks(5);
    return subTasks;
  }

  @Get(':id')
  getSubTaskSingle(@Param('id') id: string) {
    return this.subTasksService.getSingleSubTask(id, 5);
  }

  @Patch(':id')
  async updateSubTask(
    @Param('id') id: string,
    @Body('task_id') task_id: string,
    @Body('content') content: string,
    @Body('status') status: boolean,
  ) {
    console.log(id, '==id');
    const result = await this.subTasksService.updateSubTask(
      id,
      task_id,
      content,
      status,
    );
    return result;
  }

  @Delete(':id')
  async removeSubTask(@Param('id') id: string) {
    const result = await this.subTasksService.deleteSubTask(id);
    return result;
  }
}
