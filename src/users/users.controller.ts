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
    console.log(first_name, last_name, email);
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
    console.log('getAllUsers');
    const users = await this.usersService.getUsers(5);
    return users;
  }

  @Get('names')
  async getAllUserNames() {
    const users = await this.usersService.getUserNames();
    return users;
  }

  @Get('single/:id')
  getUserSingle(@Param('id') id: string) {
    return this.usersService.getSingleUser(id, 5);
  }

  @Get('basic/:id')
  getUserBasicInfo(@Param('id') id: string) {
    return this.usersService.getUserBasicInfo(id);
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
