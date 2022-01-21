import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment } from './comment.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
  ) {}

  async insertComment(
    user_id: string,
    date_time: Date,
    content: string,
    assignment_id: string,
  ) {
    const newComment = new this.commentModel({
      user_id,
      date_time,
      content,
      assignment_id,
    });

    console.log(newComment, '===newComment');

    const result = await newComment.save();
    return result.id as string;
  }

  async insertBulkComments(multipleComments: any[]) {
    const availabilities = await this.commentModel.insertMany(multipleComments);
    return availabilities;
  }

  async getComments(limiter: number) {
    const comments = await this.commentModel.find().exec();
    return comments;
  }

  async getSingleComment(id: string, limiter: number) {
    const comment = await this.commentModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return comment;
  }

  async updateComment(
    id: string,
    user_id: string,
    date_time: Date,
    content: string,
    assignment_id: string,
  ) {
    const updatedComment = await this.findComment(id);
    if (user_id) {
      updatedComment.user_id = user_id;
    }
    if (date_time) {
      updatedComment.date_time = date_time;
    }
    if (content) {
      updatedComment.content = content;
    }
    if (assignment_id) {
      updatedComment.assignment_id = assignment_id;
    }

    updatedComment.save();
    return updatedComment;
  }

  async deleteComment(commentId: string) {
    const result = await this.commentModel.deleteOne({ id: commentId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findComment(id: string): Promise<Comment> {
    let comment;
    try {
      comment = await this.commentModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find comment.');
    }
    if (!comment) {
      throw new NotFoundException('Could not find comment.');
    }
    return comment;
  }
}
