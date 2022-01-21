import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserassignedSchema } from './userassigned.model';
import { UsersassignedController } from './usersassigned.controller';
import { UsersassignedService } from './usersassigned.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Userassigned', schema: UserassignedSchema },
    ]),
  ],
  controllers: [UsersassignedController],
  providers: [UsersassignedService],
  exports: [UsersassignedService],
})
export class UsersassignedModule {}
