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

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,
    @Body('profile_picture') profile_picture: string,
  ) {
    const result = await this.usersService.insertUser(
      first_name,
      last_name,
      username,
      email,
      password,
      role,
      profile_picture,
    );
    return { _id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleUsers') multipleUsers: any) {
    const users = await this.usersService.insertBulkUsers(multipleUsers);
    return users;
  }

  @Get()
  async getAllUsers(@Request() req) {
    const users = await this.usersService.getUsers(5);
    return users;
  }

  @Get('names')
  async getAllUserNames() {
    const users = await this.usersService.getUserNamesAndRoles();
    return users;
  }

  @Get('basic')
  async getAllUsersBasicInfo() {
    const users = await this.usersService.getAllUsersBasicInfo();
    return users;
  }

  @Get('project/:_id')
  async getUsersByProjectId(@Param('_id') _id: string) {
    return await this.usersService.getUsersByProjectId(_id);
  }

  @Get('single/:_id')
  async getUserSingle(@Param('_id') _id: string) {
    return await this.usersService.getSingleUser(_id, 5);
  }

  @Get('basic/:_id')
  async getUserBasicInfo(@Param('_id') _id: string) {
    return await this.usersService.getUserBasicInfo(_id);
  }

  @Get('basic/multiple/user/:_id')
  async getUsersBasicInfoByTaskId(@Param('_id') _id: string) {
    // return await this.usersService.getUsersBasicInfoByTaskId(_id);
  }

  @Get('usernames')
  async getUsernames() {
    return await this.usersService.getUsernames();
  }

  @Get('emails')
  async getEmails() {
    return await this.usersService.getEmails();
  }

  @Patch(':_id')
  async updateUser(
    @Param('_id') _id: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,
    @Body('profile_picture') profile_picture: string,
  ) {
    const result = await this.usersService.updateUser(
      _id,
      first_name,
      last_name,
      username,
      email,
      password,
      role,
      profile_picture,
    );
    return result;
  }

  @Delete(':_id')
  async removeUser(@Param('_id') _id: string) {
    const result = await this.usersService.deleteUser(_id);
    return result;
  }
}
