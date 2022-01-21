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

import { CommentsService } from './comments.service';

// @UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async addComment(
    @Body('user_id') user_id: string,
    @Body('date_time') date_time: Date,
    @Body('content') content: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.commentsService.insertComment(
      user_id,
      date_time,
      content,
      assignment_id,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleComments') multipleComments: any) {
    const comments = await this.commentsService.insertBulkComments(
      multipleComments,
    );
    return comments;
  }

  @Get()
  async getAllComments(@Request() req) {
    console.log('getAllComments');
    const comments = await this.commentsService.getComments(5);
    return comments;
  }

  @Get(':id')
  getCommentSingle(@Param('id') id: string) {
    return this.commentsService.getSingleComment(id, 5);
  }

  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body('user_id') user_id: string,
    @Body('date_time') date_time: Date,
    @Body('content') content: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.commentsService.updateComment(
      id,
      user_id,
      date_time,
      content,
      assignment_id,
    );
    return result;
  }

  @Delete(':id')
  async removeComment(@Param('id') id: string) {
    const result = await this.commentsService.deleteComment(id);
    return result;
  }
}
