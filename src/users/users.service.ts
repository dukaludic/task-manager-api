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
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const newUser = new this.userModel({
      first_name,
      last_name,
      email,
      password,
      role,
    });

    console.log(newUser, '===newUser');

    const result = await newUser.save();
    return result.id as string;
  }

  async insertBulkUsers(multipleUsers: any[]) {
    const availabilities = await this.userModel.insertMany(multipleUsers);
    return availabilities;
  }

  async getUsers(limiter: number) {
    const users = await this.userModel.find().exec();
    return users;
  }

  async getSingleUser(id: string, limiter: number) {
    const user = await this.userModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return user;
  }

  async updateUser(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const updatedUser = await this.findUser(id);
    if (first_name) {
      updatedUser.first_name = first_name;
    }
    if (last_name) {
      updatedUser.last_name = last_name;
    }
    if (email) {
      updatedUser.email = email;
    }
    if (password) {
      updatedUser.password = password;
    }
    if (role) {
      updatedUser.role = role;
    }

    updatedUser.save();
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ id: userId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}
