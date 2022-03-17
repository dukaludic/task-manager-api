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
    return { _id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleComments') multipleComments: any) {
    const comments = await this.commentsService.insertBulkComments(
      multipleComments,
    );
    return comments;
  }

  @Get('assignment_id/:_id')
  async getCommentsByTaskId(@Param('_id') _id: string) {
    console.log(_id, '_id');
    const comments = await this.commentsService.findCommentsByAssignmentId(_id);
    return comments;
  }

  @Get()
  async getAllComments(@Request() req) {
    const comments = await this.commentsService.getComments(5);
    return comments;
  }

  @Get(':_id')
  getCommentSingle(@Param('_id') _id: string) {
    return this.commentsService.getSingleComment(_id, 5);
  }

  @Patch(':_id')
  async updateComment(
    @Param('_id') _id: string,
    @Body('user_id') user_id: string,
    @Body('date_time') date_time: Date,
    @Body('content') content: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.commentsService.updateComment(
      _id,
      user_id,
      date_time,
      content,
      assignment_id,
    );
    return result;
  }

  @Delete(':_id')
  async removeComment(@Param('_id') _id: string) {
    const result = await this.commentsService.deleteComment(_id);
    return result;
  }
}
