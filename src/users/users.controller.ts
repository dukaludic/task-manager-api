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

// @UseGuards(JwtAuthGuard)
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
    return { id: result };
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

  @Get('project/:id')
  async getUsersByProjectId(@Param('id') id: string) {
    return await this.usersService.getUsersByProjectId(id);
  }

  @Get('single/:id')
  async getUserSingle(@Param('id') id: string) {
    return await this.usersService.getSingleUser(id, 5);
  }

  @Get('basic/:id')
  async getUserBasicInfo(@Param('id') id: string) {
    return await this.usersService.getUserBasicInfo(id);
  }

  @Get('basic/multiple/user/:id')
  async getUsersBasicInfoByTaskId(@Param('id') id: string) {
    // return await this.usersService.getUsersBasicInfoByTaskId(id);
  }

  @Get('usernames')
  async getUsernames() {
    return await this.usersService.getUsernames();
  }

  @Get('emails')
  async getEmails() {
    return await this.usersService.getEmails();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,
    @Body('profile_picture') profile_picture: string,
  ) {
    const result = await this.usersService.updateUser(
      id,
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

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return result;
  }
}
