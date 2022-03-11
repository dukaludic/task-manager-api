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
    description: string,
    created_by: string,
    creation_time: Date,
    due_date: Date,
    approved: Boolean,
    approved_by: string,
    time_approved: Date,
    time_sent_to_review: Date,
    still_visible_to_worker: Boolean,
  ) {
    const newTask = new this.taskModel({
      title,
      project_id,
      assigned_users,
      project_manager_id,
      sub_tasks,
      status,
      description,
      created_by,
      creation_time,
      due_date,
      approved,
      approved_by,
      time_approved,
      time_sent_to_review,
      still_visible_to_worker,
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

      let approvedByData;
      if (tasks[i]?.approved_by) {
        approvedByData = await this.usersService.getSingleUserForProjects(
          tasks[i]?.approved_by,
          5,
        );
      }

      const data = {
        id: tasks[i]._id,
        title: tasks[i].title,
        project_id: tasks[i].project_id,
        assigned_users: assignedUsersCollection,
        sub_tasks: subtasksCollection,
        status: tasks[i].status,
        blockers: blockersCollection,
        comments: commentsCollection,
        description: tasks[i].description,
        created_by: tasks[i].created_by,
        creation_time: tasks[i].creation_time,
        due_date: tasks[i].due_date,
        approved: tasks[i].approved,
        approved_by: approvedByData,
        time_approved: tasks[i].time_approved,
        time_sent_to_review: tasks[i].time_sent_to_review,
        still_visible_to_worker: tasks[i].still_visible_to_worker,
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
      for (let j = 0; j < tasks[i].assigned_users.length; j++) {
        const user = await this.usersService.getSingleUserForProjects(
          tasks[j].assigned_users[j],
          5,
        );

        assignedUsersCollection.push(user);
      }

      const blockersCollection = await this.blockersService.getBlockersByTaskId(
        idString,
      );

      const commentsCollection =
        await this.commentsService.findCommentsByAssignmentId(idString);

      let approvedByData;
      if (tasks[i]?.approved_by) {
        approvedByData = await this.usersService.getSingleUserForProjects(
          tasks[i]?.approved_by,
          5,
        );
      }

      const data = {
        id: tasks[i]._id,
        title: tasks[i].title,
        project_id: tasks[i].project_id,
        assigned_users: assignedUsersCollection,
        sub_tasks: subtasksCollection,
        status: tasks[i].status,
        blockers: blockersCollection,
        comments: commentsCollection,
        description: tasks[i].description,
        created_by: tasks[i].created_by,
        creation_time: tasks[i].creation_time,
        due_date: tasks[i].due_date,
        approved: tasks[i].approved,
        approved_by: approvedByData,
        time_approved: tasks[i].time_approved,
        time_sent_to_review: tasks[i].time_sent_to_review,
        still_visible_to_worker: tasks[i].still_visible_to_worker,
      };

      tasksCollection.push(data);
    }

    return tasksCollection;
  }

  async getTasksPerUserId(id: string) {
    const tasks = await this.taskModel
      .find({
        assigned_users: { $in: id },
      })
      .exec();

    const tasksCollection = [];
    for (let i = 0; i < tasks.length; i++) {
      const idString = tasks[i]._id.toString();
      const subtasksCollection =
        await this.subtasksService.findSubtasksPerTaskId(idString);

      const assignedUsersCollection = [];
      for (let j = 0; j < tasks[i].assigned_users.length; j++) {
        const user = await this.usersService.getSingleUserForProjects(
          tasks[i].assigned_users[j],
          5,
        );

        assignedUsersCollection.push(user);
      }

      const blockersCollection = await this.blockersService.getBlockersByTaskId(
        idString,
      );

      const commentsCollection =
        await this.commentsService.findCommentsByAssignmentId(idString);

      let approvedByData;
      if (tasks[i]?.approved_by) {
        approvedByData = await this.usersService.getSingleUserForProjects(
          tasks[i]?.approved_by,
          5,
        );
      }

      const data = {
        id: tasks[i]._id,
        title: tasks[i].title,
        project_id: tasks[i].project_id,
        assigned_users: assignedUsersCollection,
        sub_tasks: subtasksCollection,
        status: tasks[i].status,
        blockers: blockersCollection,
        comments: commentsCollection,
        description: tasks[i].description,
        created_by: tasks[i].created_by,
        creation_time: tasks[i].creation_time,
        due_date: tasks[i].due_date,
        approved: tasks[i].approved,
        approved_by: approvedByData,
        time_approved: tasks[i].time_approved,
        time_sent_to_review: tasks[i].time_sent_to_review,
        still_visible_to_worker: tasks[i].still_visible_to_worker,
      };

      tasksCollection.push(data);
    }

    return tasksCollection;
  }

  async getSingleTask(id: string, limiter: number) {
    console.log(id, '==id');
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

    console.log('task', task);
    const assignedUsersCollection = [];
    for (let j = 0; j < task?.assigned_users.length; j++) {
      const user = await this.usersService.getSingleUserForProjects(
        task?.assigned_users[j],
        5,
      );

      assignedUsersCollection.push(user);
    }

    let approvedByData;
    if (task?.approved_by) {
      approvedByData = await this.usersService.getSingleUserForProjects(
        task?.approved_by,
        5,
      );
    }

    const data = {
      id: task?._id,
      title: task?.title,
      project_id: task?.project_id,
      assigned_users: assignedUsersCollection,
      sub_tasks: subtasksCollection,
      status: task?.status,
      blockers: blockersCollection,
      comments: commentsCollection,
      description: task?.description,
      created_by: task?.created_by,
      creation_time: task?.creation_time,
      due_date: task?.due_date,
      approved: task?.approved,
      approved_by: approvedByData,
      time_approved: task?.time_approved,
      time_sent_to_review: task?.time_sent_to_review,
      still_visible_to_worker: task?.still_visible_to_worker,
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
    description: string,
    created_by: string,
    creation_time: Date,
    due_date: Date,
    approved: boolean,
    approved_by: string,
    time_approved: Date,
    time_sent_to_review: Date,
    still_visible_to_worker: Boolean,
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
    if (created_by) {
      updatedTask.created_by = created_by;
    }
    if (creation_time) {
      updatedTask.creation_time = creation_time;
    }
    if (due_date) {
      updatedTask.due_date = due_date;
    }
    if (approved === false || approved === true) {
      updatedTask.approved = approved;
    }
    if (approved_by) {
      updatedTask.approved_by = approved_by;
    }
    if (time_approved) {
      updatedTask.time_approved = time_approved;
    }
    if (time_sent_to_review) {
      updatedTask.time_sent_to_review = time_sent_to_review;
    }
    if (still_visible_to_worker === false || still_visible_to_worker === true) {
      updatedTask.still_visible_to_worker = still_visible_to_worker;
    }

    updatedTask.save();
    return updatedTask;
  }

  async deleteTask(id: string) {
    const result = await this.taskModel
      .deleteOne({
        _id: {
          $eq: id,
        },
      })
      .exec();
    console.log(result);
    if (result.deletedCount === 1) {
      return id;
    }
    // return result.id;
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
