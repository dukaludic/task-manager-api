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

import { EventsService } from './events.service';

// @UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async addEvent(
    @Body('user_id') user_id: string,
    @Body('operation') operation: string,
    @Body('date_time') date_time: Date,
    @Body('event_object_id') event_object_id: string,
    @Body('event_object_type') event_object_type: string,
    @Body('event_target_project_id') event_target_project_id: string,
    @Body('event_target_id') event_target_id: string,
    @Body('event_target_type') event_target_type: string,
  ) {
    const result = await this.eventsService.insertEvent(
      user_id,
      operation,
      date_time,
      event_object_id,
      event_object_type,
      event_target_project_id,
      event_target_id,
      event_target_type,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleEvents') multipleEvents: any) {
    const events = await this.eventsService.insertBulkEvents(multipleEvents);
    return events;
  }

  @Get()
  async getAllEvents(@Request() req) {
    const events = await this.eventsService.getEvents(5);
    return events;
  }

  @Get('user/:id')
  async getPerUserId(@Request() req, @Param('id') id: string) {
    const events = await this.eventsService.getEventsPerUserId(id);
    return events;
  }

  @Get(':id')
  getEventSingle(@Param('id') id: string) {
    return this.eventsService.getSingleEvent(id, 5);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body('user_id') user_id: string,
    @Body('operation') operation: string,
    @Body('date_time') date_time: Date,
    @Body('event_object_id') event_object_id: string,
    @Body('event_object_type') event_object_type: string,
    @Body('event_target_project_id') event_target_project_id: string,
    @Body('event_target_id') event_target_id: string,
    @Body('event_target_type') event_target_type: string,
  ) {
    const result = await this.eventsService.updateEvent(
      id,
      user_id,
      operation,
      date_time,
      event_object_id,
      event_object_type,
      event_target_project_id,
      event_target_id,
      event_target_type,
    );
    return result;
  }

  @Delete(':id')
  async removeEvent(@Param('id') id: string) {
    const result = await this.eventsService.deleteEvent(id);
    return result;
  }
}
