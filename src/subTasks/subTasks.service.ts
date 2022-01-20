import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubTask } from './subTask.model';

@Injectable()
export class SubTasksService {
  constructor(
    @InjectModel('SubTask') private readonly subTaskModel: Model<SubTask>,
  ) {}

  async insertSubTask(task_id: string, content: string, status: boolean) {
    const newSubTask = new this.subTaskModel({
      task_id,
      content,
      status,
    });

    console.log(newSubTask, '===newSubTask');

    const result = await newSubTask.save();
    return result.id as string;
  }

  async insertBulkSubTasks(multipleSubTasks: any[]) {
    const availabilities = await this.subTaskModel.insertMany(
      multipleSubTasks,
    );
    return availabilities;
  }

  async getSubTasks(limiter: number) {
    const subTasks = await this.subTaskModel.find().exec();
    return subTasks;
  }

  async getSingleSubTask(id: string, limiter: number) {
    const subTask = await this.subTaskModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return subTask;
  }

  async updateSubTask(
    id: string,
    task_id: string,
    content: string,
    status: boolean,
  ) {
    const updatedSubTask = await this.findSubTask(id);
    if (task_id) {
      updatedSubTask.task_id = task_id;
    }
    if (content) {
      updatedSubTask.content = content;
    }
    if (status || status === false) {
      updatedSubTask.status = status;
    }

    updatedSubTask.save();
    return updatedSubTask;
  }

  async deleteSubTask(subTaskId: string) {
    const result = await this.subTaskModel.deleteOne({ id: subTaskId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findSubTask(id: string): Promise<SubTask> {
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
