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
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  async addSubtask(
    @Body('task_id') task_id: string,
    @Body('content') content: string,
    @Body('done') done: boolean,
  ) {
    const result = await this.subtasksService.insertSubtask(
      task_id,
      content,
      done,
    );
    return { _id: result };
  }

  // @Post('/multiple')
  // async addMultiple(@Body('multipleSubtasks') multipleSubtasks: any) {
  //   const subtasks = await this.subtasksService.insertBulkSubtasks(multipleSubtasks);
  //   return subtasks;
  // }

  @Get()
  async getAllSubtasks(@Request() req) {
    const subtasks = await this.subtasksService.getSubtasks(5);
    return subtasks;
  }

  @Get(':_id')
  getSubtaskSingle(@Param('_id') _id: string) {
    return this.subtasksService.getSingleSubtask(_id, 5);
  }

  @Patch(':_id')
  async updateSubtask(
    @Param('_id') _id: string,
    @Body('task_id') task_id: string,
    @Body('content') content: string,
    @Body('done') done: boolean,
  ) {
    const result = await this.subtasksService.updateSubtask(
      _id,
      task_id,
      content,
      done,
    );
    return result;
  }

  @Delete(':_id')
  async removeSubtask(@Param('_id') _id: string) {
    const result = await this.subtasksService.deleteSubtask(_id);
    return result;
  }
}
