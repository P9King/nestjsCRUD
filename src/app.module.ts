import { Module } from "@nestjs/common";
import { BoardsModule } from "./boards/boards.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "./entities/board.entity";
import { AuthModule } from './auth/auth.module';
import { User } from "./entities/user.entity";





@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'board-app',
    entities: [Board, User],
    synchronize: true,
  }),
    BoardsModule,
    AuthModule
  ],
})
export class AppModule { }
