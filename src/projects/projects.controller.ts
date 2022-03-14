import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async addProject(
    @Body('title') title: string,
    @Body('tasks') tasks: string[],
    @Body('project_manager_id') project_manager_id: string,
    @Body('assigned_users') assigned_users: string[],
    @Body('start_date') start_date: Date,
    @Body('end_date') end_date: Date,
    @Body('status') status: string,
    @Body('description') description: string,
  ) {
    const result = await this.projectsService.insertProject(
      title,
      tasks,
      project_manager_id,
      assigned_users,
      start_date,
      end_date,
      status,
      description,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleProjects') multipleProjects: any) {
    const projects = await this.projectsService.insertBulkProjects(
      multipleProjects,
    );
    return projects;
  }

  @Get()
  async getAllProjects() {
    const projects = await this.projectsService.getProjects(10);
    return projects;
  }

  @Get('user/:id')
  async getPerUserId(@Param('id') id: string) {
    const projects = await this.projectsService.getProjectsPerUserId(id);
    return projects;
  }

  @Get('single/:id')
  getProjectSingle(@Param('id') id: string) {
    return this.projectsService.getSingleProject(id, 10);
  }

  @Get('titles')
  getProjectTitles() {
    return this.projectsService.getProjectTitles();
  }

  @Get('basic/:id')
  getProjectBasicInfo(@Param('id') id: string) {
    return this.projectsService.getProjectBasicInfo(id);
  }

  @Get('task/:id')
  getByTaskId(@Param('id') id: string) {
    return this.projectsService.getProjectByTaskId(id);
  }

  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('tasks') tasks: string[],
    @Body('project_manager_id') project_manager_id: string,
    @Body('assigned_users') assigned_users: string[],
    @Body('start_date') start_date: Date,
    @Body('end_date') end_date: Date,
    @Body('status') status: string,
    @Body('description') description: string,
  ) {
    const result = await this.projectsService.updateProject(
      id,
      title,
      tasks,
      project_manager_id,
      assigned_users,
      start_date,
      end_date,
      status,
      description,
    );
    return result;
  }

  @Delete(':id')
  async removeProject(@Param('id') id: string) {
    const result = await this.projectsService.deleteProject(id);
    return result;
  }
}
