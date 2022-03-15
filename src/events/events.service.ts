import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Event } from './event.model';

import { UsersService } from '../users/users.service';
import { CommentsService } from '../comments/comments.service';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from 'src/tasks/tasks.service';
import { BlockersService } from 'src/blockers/blockers.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private commentsService: CommentsService,
    private projectsService: ProjectsService,
    private blockersService: BlockersService,
    private tasksService: TasksService,
  ) {}

  async insertEvent(
    user_id: string,
    operation: string,
    date_time: Date,
    event_object_id: string,
    event_object_type: string,
    event_target_project_id: string,
    event_target_id: string,
    event_target_type: string,
  ) {
    const newEvent = new this.eventModel({
      user_id,
      operation,
      date_time,
      event_object_id,
      event_object_type,
      event_target_project_id,
      event_target_id,
      event_target_type,
    });

    const result = await newEvent.save();
    return result._id as string;
  }

  async insertBulkEvents(multipleEvents: any[]) {
    const availabilities = await this.eventModel.insertMany(multipleEvents);
    return availabilities;
  }

  async getEvents(limiter: number) {
    const events = await this.eventModel.find().exec();

    const eventsCollection = [];
    for (let i = 0; i < events.length; i++) {
      const userData = await this.usersService.getSingleUserForEvents(
        events[i].user_id,
        10,
      );

      //Get event target data
      let eventTargetData;

      switch (events[i].event_object_type) {
        case 'comment':
          eventTargetData = await this.commentsService.getSingleComment(
            events[i].event_object_id,
            5,
          );
          break;

        default:
          break;
      }

      // const eventTargetData =

      const data = {
        _id: events[i]._id,
        user: userData,
        operation: events[i].operation,
        date_time: events[i].date_time,
        event_object: eventTargetData,
        event_object_type: events[i].event_object_type,
        event_target_project_id: events[i].event_target_project_id,
        event_target_id: events[i].event_target_id,
        event_target_type: events[i].event_target_type,
      };
      eventsCollection.push(data);
    }

    return eventsCollection;
  }

  async getEventsPerUserId(_id: string) {
    // const user = await this.usersService.getSingleUserForEvents(_id, 10);

    const projectIds = await this.projectsService.getProjectsIdsPerUserId(_id);

    let events = [];
    for (let i = 0; i < projectIds.length; i++) {
      const projectEvents = await this.eventModel.find({
        event_target_project_id: {
          $eq: projectIds[i],
        },
      });

      const projectEventsCollection = [];
      for (let j = 0; j < projectEvents.length; j++) {
        const userData = await this.usersService.getSingleUserForEvents(
          projectEvents[j].user_id,
          10,
        );

        //Get event object data
        let eventObjectData;

        switch (projectEvents[j].event_object_type) {
          case 'comment':
            break;

          default:
            break;
        }

        //get event target data
        let eventTargetData;

        switch (projectEvents[j].event_target_type) {
          case 'task':
            eventTargetData = await this.tasksService.getSingleTask(
              projectEvents[j].event_target_id,
              5,
            );
            break;

          default:
            break;
        }

        const data = {
          user: userData,
          operation: projectEvents[j].operation,
          date_time: projectEvents[j].date_time,
          event_object: eventObjectData,
          event_object_type: projectEvents[j].event_object_type,
          event_target_project_id: projectEvents[j].event_target_project_id,
          event_target: eventTargetData,
          event_target_type: projectEvents[j].event_target_type,
        };

        projectEventsCollection.push(data);
      }

      events = [...events, ...projectEventsCollection];
    }

    return events;
  }

  async getSingleEvent(_id: string, limiter: number) {
    const event = await this.eventModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    return event;
  }

  async updateEvent(
    _id: string,
    user_id: string,
    operation: string,
    date_time: Date,
    event_object_id: string,
    event_object_type: string,
    event_target_project_id: string,
    event_target_id: string,
    event_target_type: string,
  ) {
    const updatedEvent = await this.findEvent(_id);
    if (user_id) {
      updatedEvent.user_id = user_id;
    }
    if (operation) {
      updatedEvent.operation = operation;
    }
    if (date_time) {
      updatedEvent.date_time = date_time;
    }
    if (event_object_id) {
      updatedEvent.event_object_id = event_object_id;
    }
    if (event_object_type) {
      updatedEvent.event_object_type = event_object_type;
    }
    if (event_target_project_id) {
      updatedEvent.event_target_project_id = event_target_project_id;
    }
    if (event_target_id) {
      updatedEvent.event_target_id = event_target_id;
    }
    if (event_target_type) {
      updatedEvent.event_target_type = event_target_type;
    }

    updatedEvent.save();
    return updatedEvent;
  }

  async deleteEvent(eventId: string) {
    const result = await this.eventModel.deleteOne({ _id: eventId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findEvent(_id: string): Promise<Event> {
    let event;
    try {
      event = await this.eventModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find event.');
    }
    if (!event) {
      throw new NotFoundException('Could not find event.');
    }
    return event;
  }
}
