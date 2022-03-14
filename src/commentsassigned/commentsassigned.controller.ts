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

import { CommentsassignedService } from './commentsassigned.service';

// @UseGuards(JwtAuthGuard)
@Controller('commentsassigned')
export class CommentsassignedController {
  constructor(
    private readonly commentsassignedService: CommentsassignedService,
  ) {}

  @Post()
  async addCommentassigned(
    @Body('comment_id') comment_id: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.commentsassignedService.insertCommentassigned(
      comment_id,
      assignment_id,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(
    @Body('multipleCommentsassigned') multipleCommentsassigned: any,
  ) {
    const commentsassigned =
      await this.commentsassignedService.insertBulkCommentsassigned(
        multipleCommentsassigned,
      );
    return commentsassigned;
  }

  @Get()
  async getAllCommentsassigned(@Request() req) {
    const commentsassigned =
      await this.commentsassignedService.getCommentsassigned(5);
    return commentsassigned;
  }

  @Get(':id')
  getCommentassignedSingle(@Param('id') id: string) {
    return this.commentsassignedService.getSingleCommentassigned(id, 5);
  }

  @Patch(':id')
  async updateCommentassigned(
    @Param('id') id: string,
    @Body('comment_id') comment_id: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.commentsassignedService.updateCommentassigned(
      id,
      comment_id,
      assignment_id,
    );
    return result;
  }

  @Delete(':id')
  async removeCommentassigned(@Param('id') id: string) {
    const result = await this.commentsassignedService.deleteCommentassigned(id);
    return result;
  }
}
