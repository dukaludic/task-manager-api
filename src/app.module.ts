import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { BlockersModule } from './blockers/blockers.module';
import { CommentsModule } from './comments/comments.module';
import { ImagesModule } from './images/images.module';
import { ImagesassignedModule } from './imagesassigned/imagesassigned.module';
import { EventsModule } from './events/events.module';
import { SettingsModule } from './settings/settings.module';
import { UserprojectModule } from './userproject/userproject.module';
import { CommentsassignedModule } from './commentsassigned/commentsassigned.module';
import { AuthModule } from './auth/auth.module';
import { EventsassignedModule } from './eventsAssigned/eventsassigned.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB),
    UsersModule,
    ProjectsModule,
    TasksModule,
    SubtasksModule,
    BlockersModule,
    CommentsModule,
    ImagesModule,
    ImagesassignedModule,
    EventsModule,
    SettingsModule,
    UserprojectModule,
    CommentsassignedModule,
    AuthModule,
    EventsassignedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
