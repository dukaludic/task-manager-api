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

import { BlockersService } from './blockers.service';

// @UseGuards(JwtAuthGuard)
@Controller('blockers')
export class BlockersController {
  constructor(private readonly blockersService: BlockersService) {}

  @Post()
  async addBlocker(
    @Body('title') title: string,
    @Body('task_id') task_id: string,
    @Body('description') description: string,
    @Body('comments') comments: string[],
    @Body('user_id') user_id: string,
  ) {
    const result = await this.blockersService.insertBlocker(
      title,
      task_id,
      description,
      comments,
      user_id,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleBlockers') multipleBlockers: any) {
    const blockers = await this.blockersService.insertBulkBlockers(
      multipleBlockers,
    );
    return blockers;
  }

  @Get()
  async getAllBlockers(@Request() req) {
    console.log('getAllBlockers');
    const blockers = await this.blockersService.getBlockers(5);
    return blockers;
  }

  @Get(':id')
  getBlockerSingle(@Param('id') id: string) {
    return this.blockersService.getSingleBlocker(id, 5);
  }

  @Patch(':id')
  async updateBlocker(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('task_id') task_id: string,
    @Body('description') description: string,
    @Body('comments') comments: string[],
    @Body('user_id') user_id: string,
  ) {
    const result = await this.blockersService.updateBlocker(
      id,
      title,
      task_id,
      description,
      comments,
      user_id,
    );
    return result;
  }

  @Delete(':id')
  async removeBlocker(@Param('id') id: string) {
    const result = await this.blockersService.deleteBlocker(id);
    return result;
  }
}
