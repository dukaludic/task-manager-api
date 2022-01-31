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
    event_id: string,
    target_id: string,
    event_target_type: string,
  ) {
    const newEventassigned = new this.eventassignedModel({
      event_id,
      target_id,
      event_target_type,
    });

    console.log(newEventassigned, '===newEventassigned');

    const result = await newEventassigned.save();
    return result.id as string;
  }

  async insertBulkEventsassigned(multipleEventsassigned: any[]) {
    const availabilities = await this.eventassignedModel.insertMany(
      multipleEventsassigned,
    );
    return availabilities;
  }

  async getEventsassigned(limiter: number) {
    const eventsassigned = await this.eventassignedModel.find().exec();
    return eventsassigned;
  }

  async getSingleEventassigned(id: string, limiter: number) {
    const eventassigned = await this.eventassignedModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return eventassigned;
  }

  async updateEventassigned(
    id: string,
    event_id: string,
    target_id: string,
    event_target_type: string,
  ) {
    const updatedEventassigned = await this.findEventassigned(id);
    if (event_id) {
      updatedEventassigned.event_id = event_id;
    }
    if (target_id) {
      updatedEventassigned.target_id = target_id;
    }
    if (event_target_type) {
      updatedEventassigned.event_target_type = event_target_type;
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
