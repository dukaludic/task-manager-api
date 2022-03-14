import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from './user.model';
import { ProjectSchema } from '../projects/project.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserprojectModule } from 'src/userproject/userproject.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';
import { ImagesassignedModule } from 'src/imagesassigned/imagesassigned.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
    UserprojectModule,
    ProjectsModule,
    AuthModule,
    ImagesModule,
    ImagesassignedModule,
    forwardRef(() => EventsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
