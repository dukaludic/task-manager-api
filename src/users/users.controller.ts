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
  ) {
    console.log(first_name, last_name, email);
    const result = await this.usersService.insertUser(
      first_name,
      last_name,
      username,
      email,
      password,
      role,
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

  @Get(':id')
  getUserSingle(@Param('id') id: string) {
    return this.usersService.getSingleUser(id, 5);
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
  ) {
    const result = await this.usersService.updateUser(
      id,
      first_name,
      last_name,
      username,
      email,
      password,
      role,
    );
    return result;
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return result;
  }
}
