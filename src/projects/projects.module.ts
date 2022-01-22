import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectSchema } from './project.model';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    TasksModule,
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
