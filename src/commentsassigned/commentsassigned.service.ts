import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Commentassigned } from './commentassigned.model';

@Injectable()
export class CommentsassignedService {
  constructor(
    @InjectModel('Commentassigned')
    private readonly commentassignedModel: Model<Commentassigned>,
  ) {}

  async insertCommentassigned(comment_id: string, assignment_id: string) {
    const newCommentassigned = new this.commentassignedModel({
      comment_id,
      assignment_id,
    });

    const result = await newCommentassigned.save();
    return result._id as string;
  }

  async insertBulkCommentsassigned(multipleCommentsassigned: any[]) {
    const availabilities = await this.commentassignedModel.insertMany(
      multipleCommentsassigned,
    );
    return availabilities;
  }

  async getCommentsassigned(limiter: number) {
    const commentsassigned = await this.commentassignedModel.find().exec();
    return commentsassigned;
  }

  async getSingleCommentassigned(_id: string, limiter: number) {
    const commentassigned = await this.commentassignedModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    return commentassigned;
  }

  async updateCommentassigned(
    _id: string,
    comment_id: string,
    assignment_id: string,
  ) {
    const updatedCommentassigned = await this.findCommentassigned(_id);
    if (comment_id) {
      updatedCommentassigned.comment_id = comment_id;
    }
    if (assignment_id) {
      updatedCommentassigned.assignment_id = assignment_id;
    }

    updatedCommentassigned.save();
    return updatedCommentassigned;
  }

  async deleteCommentassigned(commentassignedId: string) {
    const result = await this.commentassignedModel
      .deleteOne({ _id: commentassignedId })
      .exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findCommentassigned(_id: string): Promise<Commentassigned> {
    let commentassigned;
    try {
      commentassigned = await this.commentassignedModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find commentassigned.');
    }
    if (!commentassigned) {
      throw new NotFoundException('Could not find commentassigned.');
    }
    return commentassigned;
  }
}
