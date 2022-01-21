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

import { UsersassignedService } from './usersassigned.service';

@Controller('usersassigned')
export class UsersassignedController {
  constructor(private readonly usersassignedService: UsersassignedService) {}

  @Post()
  async addUserassigned(
    @Body('project_id') project_id: string,
    @Body('user_id') user_id: string,
  ) {
    const result = await this.usersassignedService.insertUserassigned(
      project_id,
  user_id,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleUsersassigned') multipleUsersassigned: any) {
    const usersassigned = await this.usersassignedService.insertBulkUsersassigned(
      multipleUsersassigned,
    );
    return usersassigned;
  }

  @Get()
  async getAllUsersassigned(@Request() req) {
    console.log('getAllUsersassigned');
    const usersassigned = await this.usersassignedService.getUsersassigned(5);
    return usersassigned;
  }

  @Get(':id')
  getUserassignedSingle(@Param('id') id: string) {
    return this.usersassignedService.getSingleUserassigned(id, 5);
  }

  @Patch(':id')
  async updateUserassigned(
    @Param('id') id: string,
    @Body('project_id') project_id: string,
    @Body('user_id') user_id: string,
  ) {
    console.log(id, '==id');
    const result = await this.usersassignedService.updateUserassigned(
      id,
      project_id,
  user_id,
    );
    return result;
  }

  @Delete(':id')
  async removeUserassigned(@Param('id') id: string) {
    const result = await this.usersassignedService.deleteUserassigned(id);
    return result;
  }
}
