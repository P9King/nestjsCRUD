import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'Secret1234',
        });
    }
    //constructor 유효성 이상 없으면 실행되며 payload안에 토큰정보( 여기선 username이 들어있음)
    async validate(payload) {
        const { username } = payload;
        const user: User = await this.userRepository.findOne({ where: { username: username } });

        if (!user) {
            throw new UnauthorizedException()
        }
        console.log('jwt',user);
        return user;
    }
}