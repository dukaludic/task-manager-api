import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';
import { UserprojectService } from '../userproject/userproject.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private userprojectService: UserprojectService,
    private projectsService: ProjectsService,
  ) {}

  async insertUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const newUser = new this.userModel({
      first_name,
      last_name,
      email,
      password,
      role,
    });

    console.log(newUser, '===newUser');

    const result = await newUser.save();
    return result.id as string;
  }

  async insertBulkUsers(multipleUsers: any[]) {
    const availabilities = await this.userModel.insertMany(multipleUsers);
    return availabilities;
  }

  //For auth
  async findOne(username: string): Promise<User | undefined> {
    // return this.users.find((user) => user.username === username);

    const user = this.userModel.findOne({
      username: {
        $eq: username,
      },
    });

    return user;
  }

  async getUsers(limiter: number) {
    const users = await this.userModel.find().exec();

    const usersCollection = [];
    for (let i = 0; i < users.length; i++) {
      const idString = users[i]._id.toString();

      const projectsCollection = [];
      if (users[i].role === 'worker') {
        //get intermediary assignment array
        const userprojects =
          await this.userprojectService.getUserprojectsPerUserId(idString);

        console.log(userprojects, '===userprojects');

        //get collection
        for (let i = 0; i < userprojects.length; i++) {
          console.log(userprojects[i].project_id, 'userprojects[i].project_id');
          const project = await this.projectsService.getSingleProject(
            userprojects[i].project_id,
            5,
          );
          projectsCollection.push(project);
        }
      } else if (users[i].role === 'project_manager') {
        const idString = users[i]._id.toString();
        const projects =
          await this.projectsService.getProjectsByProjectManagerId(idString, 5);
        projectsCollection.push([projects]);
      }

      console.log(projectsCollection, '===projectsCollection');

      const data = {
        id: users[i]._id,
        first_name: users[i].first_name,
        last_name: users[i].last_name,
        email: users[i].email,
        password: users[i].password,
        role: users[i].role,
        projects: projectsCollection,
      };

      console.log(data, '===data');

      usersCollection.push(data);
    }

    return usersCollection;
  }

  async getSingleUserForComments(id: string, limiter: number) {
    const user = await this.userModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    return user;
  }

  async getSingleUserForProjects(id: string, limiter: number) {
    console.log(typeof id, '==id 123');
    const user = await this.userModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    console.log(user, '===user');

    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      role: user.role,
    };

    return data;
  }

  async getSingleUser(id: string, limiter: number) {
    const user = await this.userModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    //get intermediary assignment array
    const userprojects = await this.userprojectService.getUserprojectsPerUserId(
      id,
    );

    console.log(userprojects, '===userprojects');

    //get collection
    const projectsCollection = [];
    for (let i = 0; i < userprojects.length; i++) {
      console.log(userprojects[i].project_id, 'userprojects[i].project_id');
      const project = await this.projectsService.getSingleProject(
        userprojects[i].project_id,
        5,
      );
      projectsCollection.push(project);
    }

    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      role: user.role,
      projects: projectsCollection,
    };

    return data;
  }

  async updateUser(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const updatedUser = await this.findUser(id);
    if (first_name) {
      updatedUser.first_name = first_name;
    }
    if (last_name) {
      updatedUser.last_name = last_name;
    }
    if (email) {
      updatedUser.email = email;
    }
    if (password) {
      updatedUser.password = password;
    }
    if (role) {
      updatedUser.role = role;
    }

    updatedUser.save();
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ id: userId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}
