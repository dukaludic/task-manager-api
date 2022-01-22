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
    @InjectModel('Subtask') private readonly subtaskModel: Model<Subtask>,
  ) {}

  async insertSubtask(task_id: string, content: string, status: boolean) {
    const newSubtask = new this.subtaskModel({
      task_id,
      content,
      status,
    });

    console.log(newSubtask, '===newSubtask');

    const result = await newSubtask.save();
    return result.id as string;
  }

  async insertBulkSubtasks(multipleSubtasks: any[]) {
    const availabilities = await this.subtaskModel.insertMany(multipleSubtasks);
    return availabilities;
  }

  async getSubtasks(limiter: number) {
    const subtasks = await this.subtaskModel.find().exec();
    return subtasks;
  }

  async findSubtasksPerTaskId(id) {
    console.log(id, '==id');
    const subtasks = await this.subtaskModel.find({
      task_id: {
        $eq: id,
      },
    });

    return subtasks;
  }

  async getSingleSubtask(id: string, limiter: number) {
    const subtask = await this.subtaskModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return subtask;
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

  async deleteSubtask(subtaskId: string) {
    const result = await this.subtaskModel.deleteOne({ id: subtaskId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findSubtask(id: string): Promise<Subtask> {
    let subtask;
    try {
      subtask = await this.subtaskModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find subtask.');
    }
    if (!subtask) {
      throw new NotFoundException('Could not find subtask.');
    }
    return subtask;
  }
}
