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
import { Commentassigned } from '../commentsassigned/commentassigned.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Commentassigned')
    private readonly commentassignedModel: Model<Commentassigned>,
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
    return result._id as string;
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
        _id: comments[i]._id,
        user: userData,
        data_time: comments[i].date_time,
        content: comments[i].content,
        assignment_id: comments[i].assignment_id,
      };
      commentsCollection.push(data);
    }

    return commentsCollection;
  }

  async findCommentsByAssignmentId(_id: string) {
    // const comments = await this.commentModel
    //   .find({
    //     assignment_id: {
    //       $eq: _id,
    //     },
    //   })
    //   .exec();

    const commentssassigned = await this.commentassignedModel.find({
      assignment_id: { $eq: _id },
    });

    const commentsCollection = [];
    for (let i = 0; i < commentssassigned.length; i++) {
      // commentsassigned[i].comment_id

      const comment = await this.getSingleComment(
        commentssassigned[i].comment_id,
        5,
      );

      commentsCollection.push(comment);
    }

    return commentsCollection;
  }

  async getSingleComment(_id: string, limiter: number) {
    const comment = await this.commentModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    const userData = await this.usersService.getUserBasicInfo(comment.user_id);

    const data = {
      _id: comment._id,
      user: userData,
      date_time: comment.date_time,
      content: comment.content,
      assignment_id: comment.assignment_id,
    };

    return data;
  }

  async updateComment(
    _id: string,
    user_id: string,
    date_time: Date,
    content: string,
    assignment_id: string,
  ) {
    const updatedComment = await this.findComment(_id);
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
    const result = await this.commentModel.deleteOne({ _id: commentId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findComment(_id: string): Promise<Comment> {
    let comment;
    try {
      comment = await this.commentModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find comment.');
    }
    if (!comment) {
      throw new NotFoundException('Could not find comment.');
    }
    return comment;
  }
}
