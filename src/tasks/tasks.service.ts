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
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    private subtasksService: SubtasksService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private blockersService: BlockersService,
    private commentsService: CommentsService,
    @Inject(forwardRef(() => ProjectsService))
    private projectsService: ProjectsService,
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

    const result = await newTask.save();
    return result._id as string;
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

      // const projectData = this.projectsService.getProjectBasicInfo()

      const data = {
        _id: tasks[i]._id,
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

  // async getProjectByTaskId(_id: string) {
  //   // const task = await this.taskModel.findOne({ _id: { $eq: _id } }).exec();

  // project = this.projectsService.getProjectBasicInfo(_id);

  //   return project;
  // }

  async getTasksPerProjectIdOverview(_id: string) {
    const tasks = await this.taskModel
      .find({
        project_id: {
          $eq: _id,
        },
      })
      .exec();

    return tasks;
  }

  async getSingleTaskTitle(_id: string) {
    const task = await this.taskModel.findOne({ _id: { $eq: _id } });

    return {
      _id: task._id,
      title: task.title,
    };
  }

  async getTasksTitles(_id: string) {
    const tasks = await this.taskModel.find().exec();

    const tasksCollection = tasks.map((task) => {
      return { _id: task._id, title: task.title };
    });

    return tasksCollection;
  }

  async getTasksPerProjectId(_id: string) {
    console.log(_id, '_id');
    const tasks = await this.taskModel
      .find({
        project_id: {
          $eq: _id,
        },
      })
      .exec();

    const tasksCollection = [];
    for (let i = 0; i < tasks.length; i++) {
      const idString = tasks[i]._id.toString();

      // const assignedUsersCollection = [];
      // for (let j = 0; j < tasks[i].assigned_users.length; j++) {
      //   const t0 = performance.now();
      //   const user = await this.usersService.getUserBasicInfo(
      //     tasks[i].assigned_users[j],
      //   );

      //   assignedUsersCollection.push(user);
      // }

      // const blockersCollection = await this.blockersService.getBlockersByTaskId(
      //   idString,
      // );

      // const commentsCollection =
      //   await this.commentsService.findCommentsByAssignmentId(idString);

      // let approvedByData;
      // if (tasks[i]?.approved_by) {
      //   approvedByData = await this.usersService.getSingleUserForProjects(
      //     tasks[i]?.approved_by,
      //     5,
      //   );
      // }

      const data = {
        _id: tasks[i]._id,
        title: tasks[i].title,
        project_id: tasks[i].project_id,
        assigned_users: tasks[i].assigned_users,
        status: tasks[i].status,
        description: tasks[i].description,
        created_by: tasks[i].created_by,
        creation_time: tasks[i].creation_time,
        due_date: tasks[i].due_date,
        approved: tasks[i].approved,
        time_approved: tasks[i].time_approved,
        time_sent_to_review: tasks[i].time_sent_to_review,
        still_visible_to_worker: tasks[i].still_visible_to_worker,
      };

      tasksCollection.push(data);
    }

    return tasksCollection;
  }

  async getTasksBasicInfoPerProjectId(_id: string) {
    const tasks = await this.taskModel
      .find({
        project_id: {
          $eq: _id,
        },
      })
      .exec();

    return tasks;
  }

  async getTasksPerUserId(_id: string) {
    const tasks = await this.taskModel
      .find({
        $or: [
          { assigned_users: { $in: _id } },
          { project_manager_id: { $eq: _id } },
        ],
      })
      .exec();

    const tasksCollection = [];
    for (let i = 0; i < tasks.length; i++) {
      const idString = tasks[i]._id.toString();

      // const assignedUsersCollection = [];
      // for (let j = 0; j < tasks[i].assigned_users.length; j++) {
      //   const user = await this.usersService.getUserBasicInfo(
      //     tasks[i].assigned_users[j],
      //   );

      //   assignedUsersCollection.push(user);
      // }

      // const blockersCollection = await this.blockersService.getBlockersByTaskId(
      //   idString,
      // );

      // const commentsCollection =
      //   await this.commentsService.findCommentsByAssignmentId(idString);

      // let approvedByData;
      // if (tasks[i]?.approved_by) {
      //   approvedByData = await this.usersService.getSingleUserForProjects(
      //     tasks[i]?.approved_by,
      //     5,
      //   );
      // }

      const data = {
        _id: tasks[i]._id,
        title: tasks[i].title,
        project_id: tasks[i].project_id,
        assigned_users: tasks[i].assigned_users,
        status: tasks[i].status,
        description: tasks[i].description,
        created_by: tasks[i].created_by,
        creation_time: tasks[i].creation_time,
        due_date: tasks[i].due_date,
        approved: tasks[i].approved,
        time_approved: tasks[i].time_approved,
        time_sent_to_review: tasks[i].time_sent_to_review,
        still_visible_to_worker: tasks[i].still_visible_to_worker,
      };

      tasksCollection.push(data);
    }

    return tasksCollection;
  }

  async getSingleTask(_id: string, limiter: number) {
    const task = await this.taskModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    const subtasksCollection = await this.subtasksService.findSubtasksPerTaskId(
      _id,
    );

    const blockersCollection = await this.blockersService.getBlockersByTaskId(
      _id,
    );

    const commentsCollection =
      await this.commentsService.findCommentsByAssignmentId(_id);

    const assignedUsersCollection = [];
    for (let j = 0; j < task?.assigned_users.length; j++) {
      const user = await this.usersService.getUserBasicInfo(
        task?.assigned_users[j],
      );

      assignedUsersCollection.push(user);
    }

    let approvedByData;
    if (task?.approved_by) {
      approvedByData = await this.usersService.getUserBasicInfo(
        task?.approved_by,
      );
    }

    const data = {
      _id: task?._id,
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
    _id: string,
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
    const updatedTask = await this.findTask(_id);
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

  async deleteTask(_id: string) {
    const result = await this.taskModel
      .deleteOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    if (result.deletedCount === 1) {
      return _id;
    }
    // return result._id;
  }

  async deleteMany(assignment_id: string) {
    const result = await this.taskModel.deleteMany({
      project_id: { $eq: assignment_id },
    });

    console.log(result, 'result');
    return result;
  }

  private async findTask(_id: string): Promise<Task> {
    let task;
    try {
      task = await this.taskModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find task.');
    }
    if (!task) {
      throw new NotFoundException('Could not find task.');
    }
    return task;
  }
}
