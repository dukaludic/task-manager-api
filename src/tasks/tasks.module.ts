import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TaskSchema } from './task.model';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SubtasksModule } from '../subtasks/subtasks.module';
import { UsersModule } from '../users/users.module';
import { BlockersModule } from '../blockers/blockers.module';
import { CommentsModule } from '../comments/comments.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    SubtasksModule,
    forwardRef(() => UsersModule),
    BlockersModule,
    CommentsModule,
    forwardRef(() => ProjectsModule),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
