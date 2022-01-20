// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Patch,
//   Delete,
//   Request,
//   UseGuards,
//   Put,
// } from '@nestjs/common';

// import { UsersassignedService } from './usersassigned.service';

// @Controller('usersassigned')
// export class UsersassignedController {
//   constructor(private readonly usersassignedService: UsersassignedService) {}

//   @Post()
//   async addUserassigned(
//     @Body('title') title: string,
//     @Body('tasks') tasks: string[],
//     @Body('userassigned_manager_id') userassigned_manager_id: string,
//     @Body('assigned_users') assigned_users: string[],
//     @Body('start_date') start_date: Date,
//     @Body('end_date') end_date: Date,
//   ) {
//     const result = await this.usersassignedService.insertUserassigned(
//       title,
//       tasks,
//       userassigned_manager_id,
//       assigned_users,
//       start_date,
//       end_date,
//     );
//     return { id: result };
//   }

//   @Post('/multiple')
//   async addMultiple(@Body('multipleUsersassigned') multipleUsersassigned: any) {
//     const usersassigned =
//       await this.usersassignedService.insertBulkUsersassigned(
//         multipleUsersassigned,
//       );
//     return usersassigned;
//   }

//   @Get()
//   async getAllUsersassigned(@Request() req) {
//     console.log('getAllUsersassigned');
//     const usersassigned = await this.usersassignedService.getUsersassigned(5);
//     return usersassigned;
//   }

//   @Get(':id')
//   getUserassignedSingle(@Param('id') id: string) {
//     return this.usersassignedService.getSingleUserassigned(id, 5);
//   }

//   @Patch(':id')
//   async updateUserassigned(
//     @Param('id') id: string,
//     @Body('title') title: string,
//     @Body('tasks') tasks: string[],
//     @Body('userassigned_manager_id') userassigned_manager_id: string,
//     @Body('assigned_users') assigned_users: string[],
//     @Body('start_date') start_date: Date,
//     @Body('end_date') end_date: Date,
//   ) {
//     console.log(id, '==id');
//     const result = await this.usersassignedService.updateUserassigned(
//       id,
//       title,
//       tasks,
//       userassigned_manager_id,
//       assigned_users,
//       start_date,
//       end_date,
//     );
//     return result;
//   }

//   @Delete(':id')
//   async removeUserassigned(@Param('id') id: string) {
//     const result = await this.usersassignedService.deleteUserassigned(id);
//     return result;
//   }
// }
