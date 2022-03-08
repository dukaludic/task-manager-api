import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Eventassigned } from './eventassigned.model';

@Injectable()
export class EventsassignedService {
  constructor(
    @InjectModel('Eventassigned')
    private readonly eventassignedModel: Model<Eventassigned>,
  ) {}

  async insertEventassigned(
    assignment_project_id: string,
    assignment_id: string,
  ) {
    const newEventassigned = new this.eventassignedModel({
      assignment_project_id,
      assignment_id,
    });

    console.log(newEventassigned, '===newEventassigned');

    const result = await newEventassigned.save();
    return result.id as string;
  }

  async getEventsassigned(limiter: number) {
    const eventsassigned = await this.eventassignedModel.find().exec();
    return eventsassigned;
  }

  async getSingleEventassigned(id: string) {
    const eventassigned = await this.eventassignedModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();
    console.log(eventassigned, '===eventassigned');

    return eventassigned;
  }

  async updateEventassigned(
    id: string,
    assignment_project_id: string,
    assignment_id: string,
  ) {
    const updatedEventassigned = await this.findEventassigned(id);
    if (assignment_project_id) {
      updatedEventassigned.assignment_project_id = assignment_project_id;
    }
    if (assignment_id) {
      updatedEventassigned.assignment_id = assignment_id;
    }

    updatedEventassigned.save();
    return updatedEventassigned;
  }

  async deleteEventassigned(eventassignedId: string) {
    const result = await this.eventassignedModel
      .deleteOne({ id: eventassignedId })
      .exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findEventassigned(id: string): Promise<Eventassigned> {
    let eventassigned;
    try {
      eventassigned = await this.eventassignedModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find eventassigned.');
    }
    if (!eventassigned) {
      throw new NotFoundException('Could not find eventassigned.');
    }
    return eventassigned;
  }
}
