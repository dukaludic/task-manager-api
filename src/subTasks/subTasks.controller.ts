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

import { SubtasksService } from './subtasks.service';

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subTasksService: SubtasksService) {}

  @Post()
  async addSubtask(
    @Body('task_id') task_id: string,
    @Body('content') content: string,
    @Body('status') status: boolean,
  ) {
    const result = await this.subTasksService.insertSubtask(
      task_id,
      content,
      status,
    );
    return { id: result };
  }

  // @Post('/multiple')
  // async addMultiple(@Body('multipleSubtasks') multipleSubtasks: any) {
  //   const subTasks = await this.subTasksService.insertBulkSubtasks(multipleSubtasks);
  //   return subTasks;
  // }

  @Get()
  async getAllSubtasks(@Request() req) {
    console.log('getAllSubtasks');
    const subTasks = await this.subTasksService.getSubtasks(5);
    return subTasks;
  }

  @Get(':id')
  getSubtaskSingle(@Param('id') id: string) {
    return this.subTasksService.getSingleSubtask(id, 5);
  }

  @Patch(':id')
  async updateSubtask(
    @Param('id') id: string,
    @Body('task_id') task_id: string,
    @Body('content') content: string,
    @Body('status') status: boolean,
  ) {
    console.log(id, '==id');
    const result = await this.subTasksService.updateSubtask(
      id,
      task_id,
      content,
      status,
    );
    return result;
  }

  @Delete(':id')
  async removeSubtask(@Param('id') id: string) {
    const result = await this.subTasksService.deleteSubtask(id);
    return result;
  }
}
