import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task } from './task.model';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async insertTask(
    title: string,
    project_id: string,
    assigned_users: string[],
    project_manager_id: string,
    sub_tasks: string[],
    status: string,
  ) {
    const newTask = new this.taskModel({
      title,
      project_id,
      assigned_users,
      project_manager_id,
      sub_tasks,
      status,
    });

    console.log(newTask, '===newTask');

    const result = await newTask.save();
    return result.id as string;
  }

  async insertBulkTasks(multipleTasks: any[]) {
    const availabilities = await this.taskModel.insertMany(multipleTasks);
    return availabilities;
  }

  async getTasks(limiter: number) {
    const tasks = await this.taskModel.find().exec();
    return tasks;
  }

  async getSingleTask(id: string, limiter: number) {
    const task = await this.taskModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return task;
  }

  async updateTask(
    id: string,
    title: string,
    project_id: string,
    assigned_users: string[],
    project_manager_id: string,
    sub_tasks: string[],
    status: string,
  ) {
    const updatedTask = await this.findTask(id);
    if (title) {
      updatedTask.title = title;
    }
    if (project_id) {
      updatedTask.project_id = project_id;
    }
    if (assigned_users) {
      updatedTask.assigned_users = assigned_users;
    }
    if (project_manager_id) {
      updatedTask.project_manager_id = project_manager_id;
    }
    if (sub_tasks) {
      updatedTask.sub_tasks = sub_tasks;
    }
    if (status) {
      updatedTask.status = status;
    }

    updatedTask.save();
    return updatedTask;
  }

  async deleteTask(taskId: string) {
    const result = await this.taskModel.deleteOne({ id: taskId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findTask(id: string): Promise<Task> {
    let task;
    try {
      task = await this.taskModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find task.');
    }
    if (!task) {
      throw new NotFoundException('Could not find task.');
    }
    return task;
  }
}
