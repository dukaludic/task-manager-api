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

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event>,
    private usersService: UsersService,
  ) {}

  async insertEvent(
    user_id: string,
    operation: string,
    date_time: Date,
    event_target_id: string,
    event_target_type: string,
  ) {
    const newEvent = new this.eventModel({
      user_id,
      operation,
      date_time,
      event_target_id,
      event_target_type,
    });

    console.log(newEvent, '===newEvent');

    const result = await newEvent.save();
    return result.id as string;
  }

  async insertBulkEvents(multipleEvents: any[]) {
    const availabilities = await this.eventModel.insertMany(multipleEvents);
    return availabilities;
  }

  async getEvents(limiter: number) {
    const events = await this.eventModel.find().exec();

    const eventsCollection = [];
    for (let i = 0; i < events.length; i++) {
      const userData = await this.usersService.getSingleUser(
        events[i].user_id,
        10,
      );

      //Get event target data
      // switch (events[i].event_target_type) {
      //   case 'comment':
      //     const eventTargetData = await this.commentsService.getSingleComment();
      //     break;
      //   case 'project':
      //     break;
      //   case 'task':
      //     break;
      //   case 'user':
      //     break;
      //   case 'blocker':
      //     break;

      //   default:
      //     break;
      // }

      const data = {
        id: events[i].id,
        user_id: userData,
        operation: events[i].operation,
        date_time: events[i].date_time,
        event_target_id: events[i].event_target_id,
        event_target_type: events[i].event_target_type,
      };
      eventsCollection.push(data);
    }

    return eventsCollection;
  }

  async getSingleEvent(id: string, limiter: number) {
    const event = await this.eventModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return event;
  }

  async updateEvent(
    id: string,
    user_id: string,
    operation: string,
    date_time: Date,
    event_target_id: string,
    event_target_type: string,
  ) {
    const updatedEvent = await this.findEvent(id);
    if (user_id) {
      updatedEvent.user_id = user_id;
    }
    if (operation) {
      updatedEvent.operation = operation;
    }
    if (date_time) {
      updatedEvent.date_time = date_time;
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
    const result = await this.eventModel.deleteOne({ id: eventId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findEvent(id: string): Promise<Event> {
    let event;
    try {
      event = await this.eventModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find event.');
    }
    if (!event) {
      throw new NotFoundException('Could not find event.');
    }
    return event;
  }
}
