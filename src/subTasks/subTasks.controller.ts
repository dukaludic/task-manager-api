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
    return { id: result };
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

  @Get(':id')
  getSubtaskSingle(@Param('id') id: string) {
    return this.subtasksService.getSingleSubtask(id, 5);
  }

  @Patch(':id')
  async updateSubtask(
    @Param('id') id: string,
    @Body('task_id') task_id: string,
    @Body('content') content: string,
    @Body('done') done: boolean,
  ) {
    const result = await this.subtasksService.updateSubtask(
      id,
      task_id,
      content,
      done,
    );
    return result;
  }

  @Delete(':id')
  async removeSubtask(@Param('id') id: string) {
    const result = await this.subtasksService.deleteSubtask(id);
    return result;
  }
}
