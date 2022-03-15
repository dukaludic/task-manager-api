import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Userproject } from './userproject.model';

@Injectable()
export class UserprojectService {
  constructor(
    @InjectModel('Userproject')
    private readonly userprojectModel: Model<Userproject>,
  ) {}

  async insertUserproject(project_id: string, user_id: string) {
    const newUserproject = new this.userprojectModel({
      project_id,
      user_id,
    });

    const result = await newUserproject.save();
    return result._id as string;
  }

  async insertBulkUserproject(multipleUserproject: any[]) {
    const availabilities = await this.userprojectModel.insertMany(
      multipleUserproject,
    );
    return availabilities;
  }

  async getUserproject(limiter: number) {
    const userproject = await this.userprojectModel.find().exec();
    return userproject;
  }

  async getUserprojectsPerUserId(_id: string) {
    const userprojects = await this.userprojectModel.find({
      user_id: {
        $in: _id,
      },
    });

    return userprojects;
  }

  async getSingleUserproject(_id: string, limiter: number) {
    const userproject = await this.userprojectModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    return userproject;
  }

  async updateUserproject(_id: string, project_id: string, user_id: string) {
    const updatedUserproject = await this.findUserproject(_id);
    if (project_id) {
      updatedUserproject.project_id = project_id;
    }
    if (user_id) {
      updatedUserproject.user_id = user_id;
    }

    updatedUserproject.save();
    return updatedUserproject;
  }

  async deleteUserproject(userprojectId: string) {
    const result = await this.userprojectModel
      .deleteOne({ _id: userprojectId })
      .exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findUserproject(_id: string): Promise<Userproject> {
    let userproject;
    try {
      userproject = await this.userprojectModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find userproject.');
    }
    if (!userproject) {
      throw new NotFoundException('Could not find userproject.');
    }
    return userproject;
  }
}
