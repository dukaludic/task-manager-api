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
    @Body('user_id') user_id: string,
    @Body('business_id') business_id: string,
    @Body('order_id') order_id: string,
    @Body('receiver') receiver: string,
    @Body('content') content: string,
    @Body('user_status') user_status: string,
  ) {
    const result = await this.usersService.insertUser(
      user_id,
      business_id,
      order_id,
      receiver,
      content,
      user_status,
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

  @Get(':id')
  getUserSingle(@Param('id') id: string) {
    return this.usersService.getSingleUser(id, 5);
  }

  // @Put(':id')
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body('unique_user_id') unique_user_id: string,
  //   @Body('user_id') user_id: string,
  //   @Body('business_id') business_id: string,
  //   @Body('order_id') order_id: string,
  //   @Body('receiver') receiver: string,
  //   @Body('content') content: string,
  //   @Body('user_status') user_status: string,
  // ) {
  //   const result = await this.usersService.updateUser(
  //     id,
  //     user_id,
  //     business_id,
  //     order_id,
  //     receiver,
  //     content,
  //     user_status,
  //   );
  //   return result;
  // }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return result;
  }
}
