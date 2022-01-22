import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserprojectModule } from 'src/userproject/userproject.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserprojectModule,
    ProjectsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
