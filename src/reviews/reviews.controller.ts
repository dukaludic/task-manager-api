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

import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async addReview(
    @Body('task_id') task_id: string,
    @Body('approval') approval: string,
    @Body('reviewed_by') reviewed_by: string,
    @Body('reviewed_time') reviewed_time: Date,
    @Body('sent_to_review_time') sent_to_review_time: Date,
    @Body('visibility') visibility: boolean,
    @Body('assignee_id') assignee_id: string,
    @Body('project_id') project_id: string,
  ) {
    const result = await this.reviewsService.insertReview(
      task_id,
      approval,
      reviewed_by,
      reviewed_time,
      sent_to_review_time,
      visibility,
      assignee_id,
      project_id,
    );
    return { _id: result };
  }

  @Get('user/:_id')
  async getReviewsByUserId(@Param('_id') _id: string) {
    const reviews = this.reviewsService.getReviewsByUserId(_id);
    return reviews;
  }

  // @Post('/multiple')
  // async addMultiple(@Body('multipleReviews') multipleReviews: any) {
  //   const reviews = await this.reviewsService.insertBulkReviews(multipleReviews);
  //   return reviews;
  // }

  @Get()
  async getAllReviews(@Request() req) {
    const reviews = await this.reviewsService.getReviews(5);
    return reviews;
  }

  @Get(':_id')
  getReviewSingle(@Param('_id') _id: string) {
    return this.reviewsService.getSingleReview(_id, 5);
  }

  @Patch(':_id')
  async updateReview(
    @Param('_id') _id: string,
    @Body('task_id') task_id: string,
    @Body('approval') approval: string,
    @Body('reviewed_by') reviewed_by: string,
    @Body('reviewed_time') reviewed_time: Date,
    @Body('sent_to_review_time') sent_to_review_time: Date,
    @Body('visibility') visibility: boolean,
    @Body('assignee_id') assignee_id: string,
    @Body('project_id') project_id: string,
  ) {
    const result = await this.reviewsService.updateReview(
      _id,
      task_id,
      approval,
      reviewed_by,
      reviewed_time,
      sent_to_review_time,
      visibility,
      assignee_id,
      project_id,
    );
    return result;
  }

  @Delete(':_id')
  async removeReview(@Param('_id') _id: string) {
    const result = await this.reviewsService.deleteReview(_id);
    return result;
  }
}
