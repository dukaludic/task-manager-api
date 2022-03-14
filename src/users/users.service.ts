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
import { Project } from '../projects/project.model';
import { UserprojectService } from '../userproject/userproject.service';
import { ProjectsService } from '../projects/projects.service';
import { ImagesService } from 'src/images/images.service';
import { ImagesassignedService } from 'src/imagesassigned/imagesassigned.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    private userprojectService: UserprojectService,
    private projectsService: ProjectsService,
    private imagesService: ImagesService,
    private imagesassignedService: ImagesassignedService,
    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService,
  ) {}

  async insertUser(
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    role: string,
    profile_picture: string,
  ) {
    const newUser = new this.userModel({
      first_name,
      last_name,
      username,
      email,
      password,
      role,
      profile_picture,
    });

    const result = await newUser.save();
    return result.id as string;
  }

  async insertBulkUsers(multipleUsers: any[]) {
    const availabilities = await this.userModel.insertMany(multipleUsers);
    return availabilities;
  }

  //For auth
  async findUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.userModel
      .findOne({
        username: {
          $eq: username,
        },
      })
      .exec();

    return user;
  }

  async findOne(username: string): Promise<User | undefined> {
    // return this.users.find((user) => user.username === username);

    const usernameString = username.toString();

    const user = this.userModel.findOne({
      username: {
        $eq: usernameString,
      },
    });

    return user;
  }

  async getUsernames() {
    const users = await this.userModel.find().exec();

    const usernames = [];
    for (let i = 0; i < users.length; i++) {
      usernames.push(users[i].username);
    }
    return usernames;
  }

  async getEmails() {
    const users = await this.userModel.find().exec();

    const emails = [];
    for (let i = 0; i < users.length; i++) {
      emails.push(users[i].email);
    }
    return emails;
  }

  async getUserNamesAndRoles() {
    const users = await this.userModel.find().exec();

    const usersCollection = [];
    for (let i = 0; i < users.length; i++) {
      usersCollection.push({
        id: users[i].id,
        first_name: users[i].first_name,
        last_name: users[i].last_name,
        role: users[i].role,
      });
    }
    return usersCollection;
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

        //get collection
        for (let i = 0; i < userprojects.length; i++) {
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

      const data = {
        id: users[i]._id,
        first_name: users[i].first_name,
        last_name: users[i].last_name,
        username: users[i].username,
        email: users[i].email,
        password: users[i].password,
        role: users[i].role,
        projects: projectsCollection,
        profile_picture: users[i].profile_picture,
      };

      usersCollection.push(data);
    }

    return usersCollection;
  }

  async getUserBasicInfo(id: string) {
    const user = await this.userModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    const profileImageAssigned =
      await this.imagesassignedService.getSingleImageassignedByAssignmentId(
        user?.id,
      );

    const profileImage = await this.imagesService.getSingleImage(
      profileImageAssigned?.image_id,
    );

    const data = {
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      email: user?.email,
      role: user?.role,
      profile_picture: profileImage,
    };

    return data;
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

  async getSingleUserForEvents(id: string, limiter: number) {
    const user = await this.userModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    return user;
  }

  async getUsersBasicInfoByTaskId(id: string, limiter: number) {}

  async getUsersByProjectId(id: string) {
    const project = await this.projectsService.getProjectBasicInfo(id);

    const assignedUsersIds = [
      project.project_manager,
      ...project.assigned_users,
    ];
    // for (let i = 0; i < project[assigned_users].length; i++) {}

    const usersData = [];
    for (let i = 0; i < assignedUsersIds.length; i++) {
      const user = await this.getUserBasicInfo(assignedUsersIds[i]);
      usersData.push(user);
    }

    return usersData;
  }

  async getSingleUserForProjects(id: string, limiter: number) {
    const user = await this.userModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    const data = {
      id: user.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      email: user?.email,
      password: user?.password,
      role: user?.role,
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

    //get collection
    const projectsCollection = [];
    for (let i = 0; i < userprojects.length; i++) {
      const project = await this.projectsService.getSingleProject(
        userprojects[i].project_id,
        5,
      );
      projectsCollection.push(project);
    }

    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      projects: projectsCollection,
      profile_picture: user.profile_picture,
    };

    return data;
  }

  async updateUser(
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    role: string,
    profile_picture: string,
  ) {
    const updatedUser = await this.findUser(id);
    if (first_name) {
      updatedUser.first_name = first_name;
    }
    if (last_name) {
      updatedUser.last_name = last_name;
    }
    if (username) {
      updatedUser.username = username;
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
    if (profile_picture) {
      updatedUser.profile_picture = profile_picture;
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
