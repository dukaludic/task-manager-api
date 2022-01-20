import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
// import { UsersProjectsModule } from './usersProjects/usersprojects.module';
// import { UsersassignedModule } from './usersAssigned/usersAssigned.module';
import { TasksModule } from './tasks/tasks.module';
import { SubTasksModule } from './subTasks/subTasks.module';
import { BlockersModule } from './blockers/blockers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB),
    UsersModule,
    ProjectsModule,
    TasksModule,
    SubTasksModule,
    BlockersModule,
    // UsersassignedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
