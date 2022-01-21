import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Userassigned } from './userassigned.model';

@Injectable()
export class UsersassignedService {
  constructor(
    @InjectModel('Userassigned')
    private readonly userassignedModel: Model<Userassigned>,
  ) {}

  async insertUserassigned(project_id: string, user_id: string) {
    const newUserassigned = new this.userassignedModel({
      project_id,
      user_id,
    });

    console.log(newUserassigned, '===newUserassigned');

    const result = await newUserassigned.save();
    return result.id as string;
  }

  async insertBulkUsersassigned(multipleUsersassigned: any[]) {
    const availabilities = await this.userassignedModel.insertMany(
      multipleUsersassigned,
    );
    return availabilities;
  }

  async getUsersassigned(limiter: number) {
    const usersassigned = await this.userassignedModel.find().exec();
    return usersassigned;
  }

  async getSingleUserassigned(id: string, limiter: number) {
    const userassigned = await this.userassignedModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return userassigned;
  }

  async updateUserassigned(id: string, project_id: string, user_id: string) {
    const updatedUserassigned = await this.findUserassigned(id);
    if (project_id) {
      updatedUserassigned.project_id = project_id;
    }
    if (user_id) {
      updatedUserassigned.user_id = user_id;
    }

    updatedUserassigned.save();
    return updatedUserassigned;
  }

  async deleteUserassigned(userassignedId: string) {
    const result = await this.userassignedModel
      .deleteOne({ id: userassignedId })
      .exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findUserassigned(id: string): Promise<Userassigned> {
    let userassigned;
    try {
      userassigned = await this.userassignedModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find userassigned.');
    }
    if (!userassigned) {
      throw new NotFoundException('Could not find userassigned.');
    }
    return userassigned;
  }
}
