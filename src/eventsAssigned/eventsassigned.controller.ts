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
    @Body('assignment_project_id') assignment_project_id: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.eventsassignedService.insertEventassigned(
      assignment_project_id,
      assignment_id,
    );
    return { id: result };
  }

  @Get()
  async getAllEventsassigned(@Request() req) {
    const eventsassigned = await this.eventsassignedService.getEventsassigned(
      5,
    );
    return eventsassigned;
  }

  @Get(':id')
  getEventassignedSingle(@Param('id') id: string) {
    return this.eventsassignedService.getSingleEventassigned(id);
  }

  @Patch(':id')
  async updateEventassigned(
    @Param('id') id: string,
    @Body('assignment_project_id') assignment_project_id: string,
    @Body('assignment_id') assignment_id: string,
  ) {
    const result = await this.eventsassignedService.updateEventassigned(
      id,
      assignment_project_id,
      assignment_id,
    );
    return result;
  }

  @Delete(':id')
  async removeEventassigned(@Param('id') id: string) {
    const result = await this.eventsassignedService.deleteEventassigned(id);
    return result;
  }
}
