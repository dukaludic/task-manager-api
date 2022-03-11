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
    return { id: result };
  }

  @Get('user/:id')
  async getReviewsByUserId(@Param('id') id: string) {
    const reviews = this.reviewsService.getReviewsByUserId(id);
    return reviews;
  }

  // @Post('/multiple')
  // async addMultiple(@Body('multipleReviews') multipleReviews: any) {
  //   const reviews = await this.reviewsService.insertBulkReviews(multipleReviews);
  //   return reviews;
  // }

  @Get()
  async getAllReviews(@Request() req) {
    console.log('getAllReviews');
    const reviews = await this.reviewsService.getReviews(5);
    return reviews;
  }

  @Get(':id')
  getReviewSingle(@Param('id') id: string) {
    return this.reviewsService.getSingleReview(id, 5);
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body('task_id') task_id: string,
    @Body('approval') approval: string,
    @Body('reviewed_by') reviewed_by: string,
    @Body('reviewed_time') reviewed_time: Date,
    @Body('sent_to_review_time') sent_to_review_time: Date,
    @Body('visibility') visibility: boolean,
    @Body('assignee_id') assignee_id: string,
    @Body('project_id') project_id: string,
  ) {
    console.log(id, '==id');
    const result = await this.reviewsService.updateReview(
      id,
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

  @Delete(':id')
  async removeReview(@Param('id') id: string) {
    const result = await this.reviewsService.deleteReview(id);
    return result;
  }
}
