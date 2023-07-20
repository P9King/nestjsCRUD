import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Board } from "src/entities/board.entity";

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'board-app',
    entities: [Board],
    synchronize: true,
}