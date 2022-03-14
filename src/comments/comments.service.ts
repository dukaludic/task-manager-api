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

import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
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

    const result = await newComment.save();
    return result.id as string;
  }

  async insertBulkComments(multipleComments: any[]) {
    const availabilities = await this.commentModel.insertMany(multipleComments);
    return availabilities;
  }

  async getComments(limiter: number) {
    const comments = await this.commentModel.find().exec();

    const commentsCollection = [];
    for (let i = 0; i < comments.length; i++) {
      const userData = await this.usersService.getSingleUserForComments(
        comments[i].user_id,
        5,
      );

      const data = {
        id: comments[i]._id,
        user: userData,
        data_time: comments[i].date_time,
        content: comments[i].content,
        assignment_id: comments[i].assignment_id,
      };
      commentsCollection.push(data);
    }

    return commentsCollection;
  }

  async findCommentsByAssignmentId(id: string) {
    const comments = await this.commentModel
      .find({
        assignment_id: {
          $eq: id,
        },
      })
      .exec();
    const commentsCollection = [];
    for (let i = 0; i < comments.length; i++) {
      const userData = await this.usersService.getSingleUserForComments(
        comments[i].user_id,
        10,
      );

      const data = {
        id: comments[i].id,
        user: userData,
        date_time: comments[i].date_time,
        content: comments[i].content,
      };
      commentsCollection.push(data);
    }

    return commentsCollection;
  }

  async getSingleComment(id: string, limiter: number) {
    const comment = await this.commentModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    const userData = await this.usersService.getSingleUserForComments(
      comment.user_id,
      5,
    );

    const data = {
      id: comment._id,
      user: userData,
      data_time: comment.date_time,
      content: comment.content,
      assignment_id: comment.assignment_id,
    };

    return data;
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
