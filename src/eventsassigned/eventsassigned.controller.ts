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

import { EventsassignedService } from './eventsassigned.service';

// @UseGuards(JwtAuthGuard)
@Controller('eventsassigned')
export class EventsassignedController {
  constructor(private readonly eventsassignedService: EventsassignedService) {}

  @Post()
  async addEventassigned(
    @Body('event_id') event_id: string,
    @Body('target_id') target_id: string,
    @Body('event_target_type') event_target_type: string,
  ) {
    const result = await this.eventsassignedService.insertEventassigned(
      event_id,
      target_id,
      event_target_type,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(
    @Body('multipleEventsassigned') multipleEventsassigned: any,
  ) {
    const eventsassigned =
      await this.eventsassignedService.insertBulkEventsassigned(
        multipleEventsassigned,
      );
    return eventsassigned;
  }

  @Get()
  async getAllEventsassigned(@Request() req) {
    console.log('getAllEventsassigned');
    const eventsassigned = await this.eventsassignedService.getEventsassigned(
      5,
    );
    return eventsassigned;
  }

  @Get(':id')
  getEventassignedSingle(@Param('id') id: string) {
    return this.eventsassignedService.getSingleEventassigned(id, 5);
  }

  @Patch(':id')
  async updateEventassigned(
    @Param('id') id: string,
    @Body('event_id') event_id: string,
    @Body('target_id') target_id: string,
    @Body('event_target_type') event_target_type: string,
  ) {
    const result = await this.eventsassignedService.updateEventassigned(
      id,
      event_id,
      target_id,
      event_target_type,
    );
    return result;
  }

  @Delete(':id')
  async removeEventassigned(@Param('id') id: string) {
    const result = await this.eventsassignedService.deleteEventassigned(id);
    return result;
  }
}
