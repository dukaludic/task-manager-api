import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Review } from './review.model';

import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    private usersService: UsersService,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
  ) {}

  async insertReview(
    task_id: string,
    approval: string,
    reviewed_by: string,
    reviewed_time: Date,
    sent_to_review_time: Date,
    visibility: boolean,
    assignee_id: string,
    project_id: string,
  ) {
    const newReview = new this.reviewModel({
      task_id,
      approval,
      reviewed_by,
      reviewed_time,
      sent_to_review_time,
      visibility,
      assignee_id,
      project_id,
    });

    console.log(newReview, '===newReview');

    const result = await newReview.save();
    return result.id as string;
  }

  async insertBulkReviews(multipleReviews: any[]) {
    const availabilities = await this.reviewModel.insertMany(multipleReviews);
    return availabilities;
  }

  async getReviews(limiter: number) {
    const reviews = await this.reviewModel.find().exec();

    const reviewsCollection = [];
    for (let i = 0; i < reviews.length; i++) {
      const taskData = await this.tasksService.getSingleTask(reviews[i].id, 5);

      const assigneeData = await this.usersService.getUserBasicInfo(
        reviews[i].assignee_id,
      );

      const reviewedByData = await this.usersService.getUserBasicInfo(
        reviews[i].reviewed_by,
      );

      const data = {
        id: reviews[i].id,
        task: taskData,
        approval: reviews[i].approval,
        reviewed_by: reviewedByData,
        reviewed_time: reviews[i].reviewed_time,
        sent_to_review_time: reviews[i].sent_to_review_time,
        visibility: reviews[i].visibility,
        assignee: assigneeData,
        project_id: reviews[i].project_id,
      };
      reviewsCollection.push(data);
    }

    return reviewsCollection;
  }

  async getReviewsPerAssigneeId(id: string) {
    const reviews = await this.reviewModel
      .find({
        assignee_id: {
          $eq: id,
        },
      })
      .exec();

    const reviewsCollection = [];
    for (let i = 0; i < reviews.length; i++) {
      const taskData = await this.tasksService.getSingleTask(reviews[i].id, 5);

      const assigneeData = await this.usersService.getUserBasicInfo(
        reviews[i].assignee_id,
      );

      const reviewedByData = await this.usersService.getUserBasicInfo(
        reviews[i].reviewed_by,
      );

      const data = {
        id: reviews[i].id,
        task: taskData,
        approval: reviews[i].approval,
        reviewed_by: reviewedByData,
        reviewed_time: reviews[i].reviewed_time,
        sent_to_review_time: reviews[i].sent_to_review_time,
        visibility: reviews[i].visibility,
        assignee: assigneeData,
        project_id: reviews[i].project_id,
      };
      reviewsCollection.push(data);
    }

    return reviewsCollection;
  }

  async findReviewsPerTaskId(id) {
    console.log(id, '==id');
    const reviews = await this.reviewModel.find({
      task_id: {
        $eq: id,
      },
    });

    return reviews;
  }

  async getSingleReview(id: string, limiter: number) {
    const review = await this.reviewModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return review;
  }

  async getReviewsByUserId(id: string) {
    const reviews = await this.reviewModel.find({
      $or: [
        {
          assignee_id: {
            $eq: id,
          },
        },
        {
          reviewed_by: {
            $eq: id,
          },
        },
      ],
    });

    const reviewsCollection = [];
    for (let i = 0; i < reviews.length; i++) {
      const taskData = await this.tasksService.getSingleTask(
        reviews[i].task_id,
        5,
      );

      const assigneeData = await this.usersService.getUserBasicInfo(
        reviews[i].assignee_id,
      );

      const reviewedByData = await this.usersService.getUserBasicInfo(
        reviews[i].reviewed_by,
      );

      const data = {
        id: reviews[i].id,
        task: taskData,
        approval: reviews[i].approval,
        reviewed_by: reviewedByData,
        reviewed_time: reviews[i].reviewed_time,
        sent_to_review_time: reviews[i].sent_to_review_time,
        visibility: reviews[i].visibility,
        assignee: assigneeData,
        project_id: reviews[i].project_id,
      };
      reviewsCollection.push(data);
    }

    return reviewsCollection;
  }

  async updateReview(
    id: string,
    task_id: string,
    approval: string,
    reviewed_by: string,
    reviewed_time: Date,
    sent_to_review_time: Date,
    visibility: boolean,
    assignee_id: string,
    project_id: string,
  ) {
    const updatedReview = await this.findReview(id);
    if (task_id) {
      updatedReview.task_id = task_id;
    }
    if (approval) {
      updatedReview.approval = approval;
    }
    if (reviewed_by) {
      updatedReview.reviewed_by = reviewed_by;
    }
    if (reviewed_time) {
      updatedReview.reviewed_time = reviewed_time;
    }
    if (sent_to_review_time) {
      updatedReview.sent_to_review_time = sent_to_review_time;
    }
    if (visibility === true || visibility === false) {
      updatedReview.visibility = visibility;
    }
    if (assignee_id) {
      updatedReview.assignee_id = assignee_id;
    }
    if (project_id) {
      updatedReview.sent_to_review_time = sent_to_review_time;
    }

    updatedReview.save();
    return updatedReview;
  }

  async deleteReview(reviewId: string) {
    const result = await this.reviewModel.deleteOne({ id: reviewId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findReview(id: string): Promise<Review> {
    let review;
    try {
      review = await this.reviewModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find review.');
    }
    if (!review) {
      throw new NotFoundException('Could not find review.');
    }
    return review;
  }
}
