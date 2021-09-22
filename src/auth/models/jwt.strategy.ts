import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { JwtPayload } from './jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private readonly _usersRepository: UsersRepository,
        private readonly _configService: ConfigService
    ) {
        super({
            secretOrKey: _configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    // overriding default one
    public async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this._usersRepository.findOneByUserName(username);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
