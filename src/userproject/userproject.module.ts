import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserprojectSchema } from './userproject.model';
import { UserprojectController } from './userproject.controller';
import { UserprojectService } from './userproject.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Userproject', schema: UserprojectSchema },
    ]),
  ],
  controllers: [UserprojectController],
  providers: [UserprojectService],
  exports: [UserprojectService],
})
export class UserprojectModule {}
