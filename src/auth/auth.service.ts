import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; // 암호화
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    //회원가입
    async signUp(userDto: UserDto): Promise<void>{
        const {username, password} = userDto;
        
        //암호화
        const salt = await bcrypt.genSalt();
        const hashedPw = await bcrypt.hash(password, salt)

        const user = this.userRepository.create({username, password: hashedPw});

        try{
        await this.userRepository.save(user)
        }catch(err){
            console.log(err); //errror.code 23505인것을 확인
            if(err.code === '23505'){
                throw new ConflictException(`Existing username ${username}`);
            }
        }
    }

    //로그인
    async signIn(userDto: UserDto): Promise<{accessToken: string}>{
        const {username, password} = userDto;
        const user = await this.userRepository.findOne({where:{username}});

        console.log("found",user);
        
        if(user && (await bcrypt.compare(password, user.password))){
            //토큰생성 (Payload + secret)
            const payload = {username};
            const accessToken = await this.jwtService.sign(payload); //sign => (secret+payload 해줌

            console.log("accessToken",accessToken);
            //객체로 return
            return {accessToken: accessToken};
        } else {
            throw new UnauthorizedException('login failed');
        }
    }
}


