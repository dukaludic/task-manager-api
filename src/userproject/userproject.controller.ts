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
    return { id: result };
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
    console.log('getAllUserproject');
    const userproject = await this.userprojectService.getUserproject(5);
    return userproject;
  }

  @Get(':id')
  getUserprojectSingle(@Param('id') id: string) {
    return this.userprojectService.getSingleUserproject(id, 5);
  }

  @Patch(':id')
  async updateUserproject(
    @Param('id') id: string,
    @Body('project_id') project_id: string,
    @Body('user_id') user_id: string,
  ) {
    console.log(id, '==id');
    const result = await this.userprojectService.updateUserproject(
      id,
      project_id,
      user_id,
    );
    return result;
  }

  @Delete(':id')
  async removeUserproject(@Param('id') id: string) {
    const result = await this.userprojectService.deleteUserproject(id);
    return result;
  }
}
