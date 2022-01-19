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

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async insertProject(
    title: string,
    tasks: string[],
    project_manager_id: string,
    assigned_users: string[],
    start_date: Date,
    end_date: Date,
  ) {
    const newProject = new this.projectModel({
      title,
      tasks,
      project_manager_id,
      assigned_users,
      start_date,
      end_date,
    });

    console.log(newProject, '===newProject');

    const result = await newProject.save();
    return result.id as string;
  }

  async insertBulkProjects(multipleProjects: any[]) {
    const availabilities = await this.projectModel.insertMany(multipleProjects);
    return availabilities;
  }

  async getProjects(limiter: number) {
    const projects = await this.projectModel.find().exec();
    return projects;
  }

  async getSingleProject(id: string, limiter: number) {
    const project = await this.projectModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return project;
  }

  async updateProject(
    id: string,
    title: string,
    tasks: string[],
    project_manager_id: string,
    assigned_users: string[],
    start_date: Date,
    end_date: Date,
  ) {
    const updatedProject = await this.findProject(id);
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

    updatedProject.save();
    return updatedProject;
  }

  async deleteProject(projectId: string) {
    const result = await this.projectModel.deleteOne({ id: projectId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findProject(id: string): Promise<Project> {
    let project;
    try {
      project = await this.projectModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find project.');
    }
    if (!project) {
      throw new NotFoundException('Could not find project.');
    }
    return project;
  }
}
