import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'Secret1234',
      signOptions: { 
        expiresIn: 60 * 60 //3600s == 1hour
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //auth 모듈에서 사용할 수 있다.
  exports:[JwtStrategy, PassportModule] // 다른 모듈에서 사용할 수 있다?
})
export class AuthModule {}
