import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventassignedSchema } from './eventassigned.model';
import { EventsassignedController } from './eventsassigned.controller';
import { EventsassignedService } from './eventsassigned.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Eventassigned', schema: EventassignedSchema },
    ]),
  ],
  controllers: [EventsassignedController],
  providers: [EventsassignedService],
  exports: [EventsassignedService],
})
export class EventsassignedModule {}
