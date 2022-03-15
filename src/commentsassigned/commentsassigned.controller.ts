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
    return { _id: result };
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

  @Get(':_id')
  getCommentassignedSingle(@Param('_id') _id: string) {
    return this.commentsassignedService.getSingleCommentassigned(_id, 5);
  }

  @Patch(':_id')
  async updateCommentassigned(
    @Param('_id') _id: string,
    @Body('comment_id') comment_id: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.commentsassignedService.updateCommentassigned(
      _id,
      comment_id,
      assignment_id,
    );
    return result;
  }

  @Delete(':_id')
  async removeCommentassigned(@Param('_id') _id: string) {
    const result = await this.commentsassignedService.deleteCommentassigned(
      _id,
    );
    return result;
  }
}
