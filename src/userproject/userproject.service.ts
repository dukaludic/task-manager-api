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
    return result.id as string;
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

  async getUserprojectsPerUserId(id: string) {
    const userprojects = await this.userprojectModel.find({
      user_id: {
        $in: id,
      },
    });

    return userprojects;
  }

  async getSingleUserproject(id: string, limiter: number) {
    const userproject = await this.userprojectModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return userproject;
  }

  async updateUserproject(id: string, project_id: string, user_id: string) {
    const updatedUserproject = await this.findUserproject(id);
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
      .deleteOne({ id: userprojectId })
      .exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findUserproject(id: string): Promise<Userproject> {
    let userproject;
    try {
      userproject = await this.userprojectModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find userproject.');
    }
    if (!userproject) {
      throw new NotFoundException('Could not find userproject.');
    }
    return userproject;
  }
}
