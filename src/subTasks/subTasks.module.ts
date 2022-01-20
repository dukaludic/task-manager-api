import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SubTaskSchema } from './subTask.model';
import { SubTasksController } from './subTasks.controller';
import { SubTasksService } from './subTasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'SubTask', schema: SubTaskSchema }]),
  ],
  controllers: [SubTasksController],
  providers: [SubTasksService],
  exports: [SubTasksService],
})
export class SubTasksModule {}
