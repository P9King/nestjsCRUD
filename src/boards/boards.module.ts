import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from 'src/entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';





@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    AuthModule
],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [TypeOrmModule]

})
export class BoardsModule {}
