import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Subtask } from './subtask.model';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectModel('Subtask') private readonly subTaskModel: Model<Subtask>,
  ) {}

  async insertSubtask(task_id: string, content: string, status: boolean) {
    const newSubtask = new this.subTaskModel({
      task_id,
      content,
      status,
    });

    console.log(newSubtask, '===newSubtask');

    const result = await newSubtask.save();
    return result.id as string;
  }

  async insertBulkSubtasks(multipleSubtasks: any[]) {
    const availabilities = await this.subTaskModel.insertMany(multipleSubtasks);
    return availabilities;
  }

  async getSubtasks(limiter: number) {
    const subTasks = await this.subTaskModel.find().exec();
    return subTasks;
  }

  async getSingleSubtask(id: string, limiter: number) {
    const subTask = await this.subTaskModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return subTask;
  }

  async updateSubtask(
    id: string,
    task_id: string,
    content: string,
    status: boolean,
  ) {
    const updatedSubtask = await this.findSubtask(id);
    if (task_id) {
      updatedSubtask.task_id = task_id;
    }
    if (content) {
      updatedSubtask.content = content;
    }
    if (status || status === false) {
      updatedSubtask.status = status;
    }

    updatedSubtask.save();
    return updatedSubtask;
  }

  async deleteSubtask(subTaskId: string) {
    const result = await this.subTaskModel.deleteOne({ id: subTaskId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findSubtask(id: string): Promise<Subtask> {
    let subTask;
    try {
      subTask = await this.subTaskModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find subTask.');
    }
    if (!subTask) {
      throw new NotFoundException('Could not find subTask.');
    }
    return subTask;
  }
}
