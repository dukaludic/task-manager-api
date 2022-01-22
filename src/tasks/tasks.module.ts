import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TaskSchema } from './task.model';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SubtasksModule } from '../subtasks/subtasks.module';
import { UsersModule } from '../users/users.module';
import { BlockersModule } from '../blockers/blockers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    SubtasksModule,
    forwardRef(() => UsersModule),
    BlockersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
