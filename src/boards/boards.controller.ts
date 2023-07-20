import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './models/board-status.enum';
import { BoardDto } from '../dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from 'src/entities/board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/customs/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('boards')
@UseGuards((AuthGuard()))
export class BoardsController {
    private logger = new Logger('BaordController');

    constructor(private readonly boardsService: BoardsService) { }

   //게시글 생성
    @Post()
    @UsePipes(ValidationPipe)
    createBoard( @Body() boardDto,
    @GetUser() user: User): Promise<Board> {

        return this.boardsService.createBoard(boardDto, user);
    }

    // @Get('/:id')
    // getBoardById(@Param('id') id: number): Promise<Board>{
    //     return this.boardsService.getBoardById(id);
    // }
    @Get('/specific')
    getAllBoardByUser(@GetUser() user: User,): Promise<Board[]> {
        return  this.boardsService.getAllBoardByUser(user);
    }
    
    //모든 게시글 찾기
    @Get()
    getAllBoards(@GetUser() user: User): Promise<Board[]>{
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsService.getBoardsAll();
    }

    @Delete('/:id')
    deleteBoardById(@Param('id', ParseIntPipe) id: number, @GetUser() user:User): void{
        this.boardsService.deleteBoard(id, user);
    }

    @Patch('/:id/status')
    updateBoardStatus(@Param('id', ParseIntPipe) id: number, @Body('status', BoardStatusValidationPipe) status:BoardStatus) {
    
        return this.boardsService.updateBoard(id, status);
    }

}
