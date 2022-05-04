import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project } from './project.model';

import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    @Inject(forwardRef(() => TasksService))
    private tasksService: TasksService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
  ) {}

  async insertProject(
    title: string,
    tasks: string[],
    project_manager_id: string,
    assigned_users: string[],
    start_date: Date,
    end_date: Date,
    status: string,
    description: string,
  ) {
    const newProject = new this.projectModel({
      title,
      tasks,
      project_manager_id,
      assigned_users,
      start_date,
      end_date,
      status,
      description,
    });

    const result = await newProject.save();
    return result._id as string;
  }

  async insertBulkProjects(multipleProjects: any[]) {
    const availabilities = await this.projectModel.insertMany(multipleProjects);
    return availabilities;
  }

  async getProjects(limiter: number) {
    const projects = await this.projectModel.find().exec();

    const projectsCollection = [];
    for (let i = 0; i < projects.length; i++) {
      if (projects[i] === null) {
        continue;
      }

      const idString = projects[i]._id.toString();

      const tasksCollection = await this.tasksService.getTasksPerProjectId(
        projects[i]._id,
      );
      const commentsCollection =
        await this.commentsService.findCommentsByAssignmentId(idString);

      const assignedUsersCollection = [];
      for (let j = 0; j < projects[i].assigned_users.length; j++) {
        const user = await this.usersService.getUserBasicInfo(
          projects[i].assigned_users[j],
        );
        assignedUsersCollection.push(user);
      }

      const data = {
        _id: projects[i]._id,
        title: projects[i].title,
        tasks: tasksCollection,
        assigned_users: assignedUsersCollection,
        start_date: projects[i].start_date,
        end_date: projects[i].end_date,
        comments: commentsCollection,
        status: projects[i].status,
        description: projects[i].description,
      };

      projectsCollection.push(data);
    }
    return projectsCollection;
  }

  //for events
  async getProjectsIdsPerUserId(_id: string) {
    const projects = await this.projectModel
      .find({
        assigned_users: {
          $in: _id,
        },
      })
      .exec();

    const projectIdsCollection = [];
    for (let i = 0; i < projects.length; i++) {
      projectIdsCollection.push(projects[i]._id);
    }

    return projectIdsCollection;
  }

  async getProjectTitles() {
    const projects = await this.projectModel.find().exec();

    const projectCollection = [];
    for (let i = 0; i < projects.length; i++) {
      const project = {
        _id: projects[i]._id,
        title: projects[i].title,
      };
      projectCollection.push(project);
    }
    return projectCollection;
  }

  async getProjectBasicInfo(_id: string) {
    const project = await this.projectModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    const data = {
      _id: project._id,
      title: project.title,
      project_manager: project.project_manager_id,
      assigned_users: project.assigned_users,
    };

    return data;
  }

  async getProjectByTaskId(_id: string) {
    const project = await this.projectModel.findOne({
      tasks: {
        $in: _id,
      },
    });

    return project;
  }

  async getPerUserIdOverview(_id: string) {
    const projects = await this.projectModel
      .find({
        $or: [
          { assigned_users: { $in: _id } },
          { project_manager_id: { $eq: _id } },
        ],
      })
      .exec();

    const projectsCollection = [];
    for (let i = 0; i < projects.length; i++) {
      const tasksCollection =
        await this.tasksService.getTasksPerProjectIdOverview(projects[i]._id);

      const data = {
        _id: projects[i]._id,
        title: projects[i].title,
        tasks: tasksCollection,
        start_date: projects[i].start_date,
        end_date: projects[i].end_date,
        status: projects[i].status,
        description: projects[i].description,
      };
      projectsCollection.push(data);
    }
    return projectsCollection;
  }

  async getProjectsPerUserId(_id: string) {
    const projects = await this.projectModel
      .find({
        $or: [
          { assigned_users: { $in: _id } },
          { project_manager_id: { $eq: _id } },
        ],
      })
      .exec();

    console.time('Function 1');

    const projectsCollection = [];
    for (let i = 0; i < projects.length; i++) {
      const idString = projects[i]._id.toString();

      const tasksCollection = await this.tasksService.getTasksPerProjectId(
        projects[i]._id,
      );

      const commentsCollection =
        await this.commentsService.findCommentsByAssignmentId(idString);

      const assignedUsersCollection = [];
      for (let j = 0; j < projects[i].assigned_users.length; j++) {
        const user = await this.usersService.getUserBasicInfo(
          projects[i].assigned_users[j],
        );
        assignedUsersCollection.push(user);
      }

      const projectManagerData = await this.usersService.getUserBasicInfo(
        projects[i].project_manager_id,
      );

      const data = {
        _id: projects[i]._id,
        title: projects[i].title,
        tasks: tasksCollection,
        assigned_users: assignedUsersCollection,
        project_manager: projectManagerData,
        start_date: projects[i].start_date,
        end_date: projects[i].end_date,
        comments: commentsCollection,
        status: projects[i].status,
        description: projects[i].description,
      };

      projectsCollection.push(data);
    }
    console.timeEnd('end');
    return projectsCollection;
  }

  async getProjectsByProjectManagerId(_id: string, limiter: number) {
    const projects = await this.projectModel
      .find({
        project_manager_id: {
          $eq: _id,
        },
      })
      .exec();

    const projectsCollection = [];
    for (let i = 0; i < projects.length; i++) {
      if (projects[i] === null) {
        continue;
      }

      const tasksCollection = [];
      for (let j = 0; j < projects[i].tasks.length; j++) {
        const task = await this.tasksService.getSingleTask(
          projects[i].tasks[j],
          5,
        );
        tasksCollection.push(task);
      }

      const assignedUsersCollection = [];
      for (let j = 0; j < projects[i].assigned_users.length; j++) {
        const user = await this.usersService.getSingleUserForProjects(
          projects[i].assigned_users[j],
          5,
        );
        assignedUsersCollection.push(user);
      }

      const data = {
        _id: projects[i]._id,
        title: projects[i].title,
        tasks: tasksCollection,
        assigned_users: assignedUsersCollection,
        start_date: projects[i].start_date,
        end_date: projects[i].end_date,
        status: projects[i].status,
        description: projects[i].description,
      };

      projectsCollection.push(data);
    }
    return projectsCollection;
  }

  async getSingleProject(_id: string, limiter: number) {
    const project = await this.projectModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    if (project === null) {
      return;
    }

    const commentsCollection =
      await this.commentsService.findCommentsByAssignmentId(_id);

    const tasksCollection = [];
    for (let i = 0; i < project.tasks.length; i++) {
      const task = await this.tasksService.getSingleTask(project.tasks[i], 5);
      tasksCollection.push(task);
    }

    const projectManagerData = await this.usersService.getUserBasicInfo(
      project.project_manager_id,
    );

    const assignedUsersCollection = [];
    for (let i = 0; i < project.assigned_users.length; i++) {
      const user = await this.usersService.getUserBasicInfo(
        project.assigned_users[i],
      );
      assignedUsersCollection.push(user);
    }

    const data = {
      _id: project._id,
      title: project.title,
      tasks: tasksCollection,
      project_manager: projectManagerData,
      assigned_users: assignedUsersCollection,
      start_date: project.start_date,
      end_date: project.end_date,
      status: project.status,
      description: project.description,
      comments: commentsCollection,
    };

    return data;
  }

  async updateProject(
    _id: string,
    title: string,
    tasks: string[],
    project_manager_id: string,
    assigned_users: string[],
    start_date: Date,
    end_date: Date,
    status: string,
    description: string,
  ) {
    const updatedProject = await this.findProject(_id);
    if (title) {
      updatedProject.title = title;
    }
    if (tasks) {
      updatedProject.tasks = tasks;
    }
    if (project_manager_id) {
      updatedProject.project_manager_id = project_manager_id;
    }
    if (assigned_users) {
      updatedProject.assigned_users = assigned_users;
    }
    if (start_date) {
      updatedProject.start_date = start_date;
    }
    if (end_date) {
      updatedProject.end_date = end_date;
    }
    if (status) {
      updatedProject.status = status;
    }
    if (description) {
      updatedProject.description = description;
    }

    updatedProject.save();
    return updatedProject;
  }

  async deleteProject(projectId: string) {
    const result = await this.projectModel.deleteOne({ _id: projectId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findProject(_id: string): Promise<Project> {
    let project;
    try {
      project = await this.projectModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find project.');
    }
    if (!project) {
      throw new NotFoundException('Could not find project.');
    }
    return project;
  }
}
