import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardDto } from '../dto/create-board.dto';
import { Board } from 'src/entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardStatus } from './models/board-status.enum';
import { User } from 'src/entities/user.entity';


@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) { }

    //게시글 생성
    async createBoard(boardDto: BoardDto, user: User): Promise<Board> {
        const { title, description } = boardDto;

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user: user

        })
        await this.boardRepository.save(board);
        return board;
    }

    // 모든 게시글 찾기
    async getBoardsAll(): Promise<Board[]>{
      const boards = await this.boardRepository.find();
      return boards;
    }

    //특정 회원 게시글 전부 찾기
    async getAllBoardByUser(user: User): Promise<Board[]>{

        const query = this.boardRepository.createQueryBuilder('board'); //아마 테이블 명?
        query.where('board.userId = :userId', {'userId' : user.id})
        const boards = await query.getMany();
        return boards;
      }
    

    // 특정 게시글 찾기
    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne({ where: { id } });

        if (!found) {
            throw new NotFoundException(`Can't find board with id ${id}`);
        }

        return found;
    }

    //게시글 지우기
    async deleteBoard(id: number, user:User): Promise<void> {
        console.log("user.id", user.id);
        const query = this.boardRepository.createQueryBuilder('board');
        query.where('board."userId" = :userId', {userId: user.id})
        .andWhere('board.id = id', {id})
        .delete().execute();
        console.log(query);
         //const result = await this.boardRepository.delete({user: user.id, id: id});

        // if (result.affected === 0) {
  
        //     throw new NotFoundException(`Can't find board id ${id}`);
        // }

        // console.log(`${id} is deleted`);
    }

    //게시글 수정
    async updateBoard(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);
        board.status = status;
        await this.boardRepository.save(board);
        
        return board;
    }

    // deleteBoardById(id: String): void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter(board => board.id !== found.id);
    // }

    // updateBoardStatus(id: String, status: BoardStatus): BoardModel{
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

}
