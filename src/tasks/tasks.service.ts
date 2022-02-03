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
import { SubtasksService } from 'src/subtasks/subtasks.service';
import { UsersService } from 'src/users/users.service';
import { BlockersService } from '../blockers/blockers.service';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    private subtasksService: SubtasksService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private blockersService: BlockersService,
    private commentsService: CommentsService,
  ) {}

  async insertTask(
    title: string,
    project_id: string,
    assigned_users: string[],
    project_manager_id: string,
    sub_tasks: string[],
    status: string,
    description: string
  ) {
    const newTask = new this.taskModel({
      title,
      project_id,
      assigned_users,
      project_manager_id,
      sub_tasks,
      status,
      description
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

    const tasksCollection = [];
    for (let i = 0; i < tasks.length; i++) {
      const idString = tasks[i]._id.toString();
      const subtasksCollection =
        await this.subtasksService.findSubtasksPerTaskId(idString);

      const assignedUsersCollection = [];
      for (let i = 0; i < tasks[i].assigned_users.length; i++) {
        const user = await this.usersService.getSingleUserForProjects(
          tasks[i].assigned_users[i],
          5,
        );

        assignedUsersCollection.push(user);
      }

      const blockersCollection = await this.blockersService.getBlockersByTaskId(
        idString,
      );

      const commentsCollection =
        await this.commentsService.findCommentsByAssignmentId(idString);

      const data = {
        id: tasks[i]._id,
        title: tasks[i].title,
        project_id: tasks[i].project_id,
        assigned_users: assignedUsersCollection,
        sub_tasks: subtasksCollection,
        status: tasks[i].status,
        blockers: blockersCollection,
        comments: commentsCollection,
        description:tasks[i].description
      };

      tasksCollection.push(data);
    }

    return tasksCollection;
  }

  async getTasksPerProjectId(id: string) {
    console.log(id, '====getTaskPerProjectId id');
    const tasks = await this.taskModel
      .find({
        project_id: {
          $eq: id,
        },
      })
      .exec();

    const tasksCollection = [];
    for (let i = 0; i < tasks.length; i++) {
      const idString = tasks[i]._id.toString();
      const subtasksCollection =
        await this.subtasksService.findSubtasksPerTaskId(idString);

      const assignedUsersCollection = [];
      for (let i = 0; i < tasks[i].assigned_users.length; i++) {
        const user = await this.usersService.getSingleUserForProjects(
          tasks[i].assigned_users[i],
          5,
        );

        assignedUsersCollection.push(user);
      }

      const blockersCollection = await this.blockersService.getBlockersByTaskId(
        idString,
      );

      const commentsCollection =
        await this.commentsService.findCommentsByAssignmentId(idString);

      const data = {
        id: tasks[i]._id,
        title: tasks[i].title,
        project_id: tasks[i].project_id,
        assigned_users: assignedUsersCollection,
        sub_tasks: subtasksCollection,
        status: tasks[i].status,
        blockers: blockersCollection,
        comments: commentsCollection,
        description: tasks[i].description
      };

      tasksCollection.push(data);
    }

    return tasksCollection;
  }

  async getSingleTask(id: string, limiter: number) {
    const task = await this.taskModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    const subtasksCollection = await this.subtasksService.findSubtasksPerTaskId(
      id,
    );

    const blockersCollection = await this.blockersService.getBlockersByTaskId(
      id,
    );

    const commentsCollection =
      await this.commentsService.findCommentsByAssignmentId(id);

    const assignedUsersCollection = [];
    for (let i = 0; i < task.assigned_users.length; i++) {
      const user = await this.usersService.getSingleUserForProjects(
        task.assigned_users[i],
        5,
      );

      assignedUsersCollection.push(user);
    }

    const data = {
      id: task._id,
      title: task.title,
      project_id: task.project_id,
      assigned_users: assignedUsersCollection,
      sub_tasks: subtasksCollection,
      status: task.status,
      blockers: blockersCollection,
      comments: commentsCollection,
      description: task.description,
    };

    return data;
  }

  async updateTask(
    id: string,
    title: string,
    project_id: string,
    assigned_users: string[],
    project_manager_id: string,
    sub_tasks: string[],
    status: string,
    description: string
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
    if (description) {
      updatedTask.description = description;
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
