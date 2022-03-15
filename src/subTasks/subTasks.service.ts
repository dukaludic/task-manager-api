import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Subtask } from './subtask.model';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectModel('Subtask') private readonly subtaskModel: Model<Subtask>,
  ) {}

  async insertSubtask(task_id: string, content: string, done: boolean) {
    const newSubtask = new this.subtaskModel({
      task_id,
      content,
      done,
    });

    const result = await newSubtask.save();
    return result._id as string;
  }

  async insertBulkSubtasks(multipleSubtasks: any[]) {
    const availabilities = await this.subtaskModel.insertMany(multipleSubtasks);
    return availabilities;
  }

  async getSubtasks(limiter: number) {
    const subtasks = await this.subtaskModel.find().exec();
    return subtasks;
  }

  async findSubtasksPerTaskId(_id: string) {
    const subtasks = await this.subtaskModel.find({
      task_id: {
        $eq: _id,
      },
    });

    return subtasks;
  }

  async getSingleSubtask(_id: string, limiter: number) {
    const subtask = await this.subtaskModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    return subtask;
  }

  async updateSubtask(
    _id: string,
    task_id: string,
    content: string,
    done: boolean,
  ) {
    const updatedSubtask = await this.findSubtask(_id);
    if (task_id) {
      updatedSubtask.task_id = task_id;
    }
    if (content) {
      updatedSubtask.content = content;
    }
    if (done === true || done === false) {
      updatedSubtask.done = done;
    }

    updatedSubtask.save();
    return updatedSubtask;
  }

  async deleteSubtask(subtaskId: string) {
    const result = await this.subtaskModel.deleteOne({ _id: subtaskId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findSubtask(_id: string): Promise<Subtask> {
    let subtask;
    try {
      subtask = await this.subtaskModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find subtask.');
    }
    if (!subtask) {
      throw new NotFoundException('Could not find subtask.');
    }
    return subtask;
  }
}
