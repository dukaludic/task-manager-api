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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('eventsassigned')
export class EventsassignedController {
  constructor(private readonly eventsassignedService: EventsassignedService) {}

  @Post()
  async addEventassigned(
    @Body('assignment_project_id') assignment_project_id: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.eventsassignedService.insertEventassigned(
      assignment_project_id,
      assignment_id,
    );
    return { _id: result };
  }

  @Get()
  async getAllEventsassigned(@Request() req) {
    const eventsassigned = await this.eventsassignedService.getEventsassigned(
      5,
    );
    return eventsassigned;
  }

  @Get(':_id')
  getEventassignedSingle(@Param('_id') _id: string) {
    return this.eventsassignedService.getSingleEventassigned(_id);
  }

  @Patch(':_id')
  async updateEventassigned(
    @Param('_id') _id: string,
    @Body('assignment_project_id') assignment_project_id: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.eventsassignedService.updateEventassigned(
      _id,
      assignment_project_id,
      assignment_id,
    );
    return result;
  }

  @Delete(':_id')
  async removeEventassigned(@Param('_id') _id: string) {
    const result = await this.eventsassignedService.deleteEventassigned(_id);
    return result;
  }
}
