import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/customs/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    //회원가입
    @Post('/signup')
    signUp( @Body() userDto: UserDto): Promise<void> {
        return this.authService.signUp(userDto);
    }

    //로그인
    @Post('/signin')
    signIn( @Body() userDto: UserDto): Promise<{accessToken: string}>{
        return this.authService.signIn(userDto);
    }

    //custom decorator
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User): void{
        console.log('user', user);
    }


}
