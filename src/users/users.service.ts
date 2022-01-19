import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async insertUser(
    user_id: string,
    business_id: string,
    order_id: string,
    receiver: string,
    content: string,
    user_status: string,
  ) {
    const unique_user_id = `INC${uuidv4(12)}`;

    const newUser = new this.userModel({
      unique_user_id,
      user_id,
      business_id,
      order_id,
      receiver,
      content,
      user_status,
    });

    const result = await newUser.save();
    return result._id as string;
  }

  async insertBulkUsers(multipleUsers: any[]) {
    const availabilities = await this.userModel.insertMany(multipleUsers);
    return availabilities;
  }

  async getUsers(limiter: number) {
    const users = await this.userModel.find().exec();
    return users;
  }

  async getSingleUser(_id: string, limiter: number) {
    const user = await this.userModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    return user;
  }

  // async updateUser(
  //   _id: string,
  //   user_id: string,
  //   business_id: string,
  //   order_id: string,
  //   receiver: string,
  //   content: string,
  //   user_status: string,
  // ) {
  //   const updatedUser = await this.findUser(_id);
  //   if (user_id) {
  //     updatedUser.user_id = user_id;
  //   }
  //   if (business_id) {
  //     updatedUser.business_id = business_id;
  //   }
  //   if (order_id) {
  //     updatedUser.order_id = order_id;
  //   }
  //   if (receiver) {
  //     updatedUser.receiver = receiver;
  //   }
  //   if (content) {
  //     updatedUser.content = content;
  //   }
  //   if (user_status) {
  //     updatedUser.user_status = user_status;
  //   }
  //   updatedUser.save();
  //   return updatedUser;
  // }

  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findUser(_id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}
