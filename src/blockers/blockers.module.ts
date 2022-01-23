import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlockerSchema } from './blocker.model';
import { BlockersController } from './blockers.controller';
import { BlockersService } from './blockers.service';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Blocker', schema: BlockerSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [BlockersController],
  providers: [BlockersService],
  exports: [BlockersService],
})
export class BlockersModule {}
