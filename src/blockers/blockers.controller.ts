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
    return { _id: result };
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
    const blockers = await this.blockersService.getBlockers(5);
    return blockers;
  }

  @Get(':_id')
  getBlockerSingle(@Param('_id') _id: string) {
    return this.blockersService.getSingleBlocker(_id, 5);
  }

  @Patch(':_id')
  async updateBlocker(
    @Param('_id') _id: string,
    @Body('title') title: string,
    @Body('task_id') task_id: string,
    @Body('description') description: string,
    @Body('comments') comments: string[],
    @Body('user_id') user_id: string,
  ) {
    const result = await this.blockersService.updateBlocker(
      _id,
      title,
      task_id,
      description,
      comments,
      user_id,
    );
    return result;
  }

  @Delete(':_id')
  async removeBlocker(@Param('_id') _id: string) {
    const result = await this.blockersService.deleteBlocker(_id);
    return result;
  }
}
