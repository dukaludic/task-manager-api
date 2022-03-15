import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blocker } from './blocker.model';

import { UsersService } from '../users/users.service';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class BlockersService {
  constructor(
    @InjectModel('Blocker') private readonly blockerModel: Model<Blocker>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
  ) {}

  async insertBlocker(
    title: string,
    task_id: string,
    description: string,
    comments: string[],
    user_id: string,
  ) {
    const newBlocker = new this.blockerModel({
      title,
      task_id,
      description,
      comments,
      user_id,
    });

    const result = await newBlocker.save();
    return result._id as string;
  }

  async insertBulkBlockers(multipleBlockers: any[]) {
    const availabilities = await this.blockerModel.insertMany(multipleBlockers);
    return availabilities;
  }

  async getBlockers(limiter: number) {
    const blockers = await this.blockerModel.find().exec();
    return blockers;
  }

  async getBlockersByTaskId(_id: string) {
    const blockers = await this.blockerModel
      .find({
        task_id: {
          $eq: _id,
        },
      })
      .exec();

    return blockers;
  }

  async getSingleBlocker(_id: string, limiter: number) {
    const blocker = await this.blockerModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    const userData = await this.usersService.getSingleUserForProjects(
      blocker.user_id,
      5,
    );

    const commentsCollection =
      await this.commentsService.findCommentsByAssignmentId(_id);

    const data = {
      _id: blocker._id,
      title: blocker.title,
      task_id: blocker.task_id,
      description: blocker.description,
      comments: commentsCollection,
      user: userData,
    };

    return data;
  }

  async updateBlocker(
    _id: string,
    title: string,
    task_id: string,
    description: string,
    comments: string[],
    user_id: string,
  ) {
    const updatedBlocker = await this.findBlocker(_id);
    if (title) {
      updatedBlocker.title = title;
    }
    if (task_id) {
      updatedBlocker.task_id = task_id;
    }
    if (description) {
      updatedBlocker.description = description;
    }
    if (comments) {
      updatedBlocker.comments = comments;
    }
    if (user_id) {
      updatedBlocker.user_id = user_id;
    }

    updatedBlocker.save();
    return updatedBlocker;
  }

  async deleteBlocker(blockerId: string) {
    const result = await this.blockerModel.deleteOne({ _id: blockerId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findBlocker(_id: string): Promise<Blocker> {
    let blocker;
    try {
      blocker = await this.blockerModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find blocker.');
    }
    if (!blocker) {
      throw new NotFoundException('Could not find blocker.');
    }
    return blocker;
  }
}
