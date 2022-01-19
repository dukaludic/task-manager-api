import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
// import { UsersProjectsModule } from './usersProjects/usersprojects.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB),
    UsersModule,
    ProjectsModule,
    // UsersProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
