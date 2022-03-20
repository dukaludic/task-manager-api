import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
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
import { ReviewsModule } from './reviews/reviews.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register({
      ttl: 120,
    }),
    ConfigModule.forRoot(),
    CacheModule.register(),
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
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
