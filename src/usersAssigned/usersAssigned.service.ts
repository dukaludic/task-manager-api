// import {
//   Inject,
//   Injectable,
//   NotFoundException,
//   forwardRef,
// } from '@nestjs/common';

// import { v4 as uuidv4 } from 'uuid';

// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import { Userassigned } from './userassigned.model';

// @Injectable()
// export class UsersassignedService {
//   constructor(
//     @InjectModel('Userassigned')
//     private readonly userassignedModel: Model<Userassigned>,
//   ) {}

//   async insertUserassigned(
//     title: string,
//     tasks: string[],
//     userassigned_manager_id: string,
//     assigned_users: string[],
//     start_date: Date,
//     end_date: Date,
//   ) {
//     const newUserassigned = new this.userassignedModel({
//       title,
//       tasks,
//       userassigned_manager_id,
//       assigned_users,
//       start_date,
//       end_date,
//     });

//     console.log(newUserassigned, '===newUserassigned');

//     const result = await newUserassigned.save();
//     return result.id as string;
//   }

//   async insertBulkUsersassigned(multipleUsersassigned: any[]) {
//     const availabilities = await this.userassignedModel.insertMany(
//       multipleUsersassigned,
//     );
//     return availabilities;
//   }

//   async getUsersassigned(limiter: number) {
//     const usersassigned = await this.userassignedModel.find().exec();
//     return usersassigned;
//   }

//   async getSingleUserassigned(id: string, limiter: number) {
//     const userassigned = await this.userassignedModel
//       .findOne({
//         id: {
//           $eq: id,
//         },
//       })
//       .exec();

//     return userassigned;
//   }

//   async updateUserassigned(
//     id: string,
//     title: string,
//     tasks: string[],
//     userassigned_manager_id: string,
//     assigned_users: string[],
//     start_date: Date,
//     end_date: Date,
//   ) {
//     const updatedUserassigned = await this.findUserassigned(id);
//     if (title) {
//       updatedUserassigned.title = title;
//     }
//     if (tasks) {
//       updatedUserassigned.tasks = tasks;
//     }
//     if (userassigned_manager_id) {
//       updatedUserassigned.userassigned_manager_id = userassigned_manager_id;
//     }
//     if (assigned_users) {
//       updatedUserassigned.assigned_users = assigned_users;
//     }
//     if (start_date) {
//       updatedUserassigned.start_date = start_date;
//     }
//     if (end_date) {
//       updatedUserassigned.end_date = end_date;
//     }

//     updatedUserassigned.save();
//     return updatedUserassigned;
//   }

//   async deleteUserassigned(userassignedId: string) {
//     const result = await this.userassignedModel
//       .deleteOne({ id: userassignedId })
//       .exec();
//     return {
//       message: `Deleted ${result.deletedCount} item from database`,
//     };
//   }

//   private async findUserassigned(id: string): Promise<Userassigned> {
//     let userassigned;
//     try {
//       userassigned = await this.userassignedModel.findById(id).exec();
//     } catch (error) {
//       throw new NotFoundException('Could not find userassigned.');
//     }
//     if (!userassigned) {
//       throw new NotFoundException('Could not find userassigned.');
//     }
//     return userassigned;
//   }
// }
