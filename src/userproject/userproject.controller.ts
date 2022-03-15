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

import { UserprojectService } from './userproject.service';

@Controller('userproject')
export class UserprojectController {
  constructor(private readonly userprojectService: UserprojectService) {}

  @Post()
  async addUserproject(
    @Body('project_id') project_id: string,
    @Body('user_id') user_id: string,
  ) {
    const result = await this.userprojectService.insertUserproject(
      project_id,
      user_id,
    );
    return { _id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleUserproject') multipleUserproject: any) {
    const userproject = await this.userprojectService.insertBulkUserproject(
      multipleUserproject,
    );
    return userproject;
  }

  @Get()
  async getAllUserproject(@Request() req) {
    const userproject = await this.userprojectService.getUserproject(5);
    return userproject;
  }

  @Get(':_id')
  getUserprojectSingle(@Param('_id') _id: string) {
    return this.userprojectService.getSingleUserproject(_id, 5);
  }

  @Patch(':_id')
  async updateUserproject(
    @Param('_id') _id: string,
    @Body('project_id') project_id: string,
    @Body('user_id') user_id: string,
  ) {
    const result = await this.userprojectService.updateUserproject(
      _id,
      project_id,
      user_id,
    );
    return result;
  }

  @Delete(':_id')
  async removeUserproject(@Param('_id') _id: string) {
    const result = await this.userprojectService.deleteUserproject(_id);
    return result;
  }
}
