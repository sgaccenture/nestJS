import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
    private readonly _logger = new Logger(`/auth`, true);
    constructor(
        @InjectRepository(UsersRepository)
        private _usersRepository: UsersRepository,
        private _jwtService: JwtService
    ) { }

    public async signUp(dto: AuthCredentialsDto): Promise<void> {
        try {
            const { password } = dto;
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            return await this._usersRepository.createOne({ ...dto, password: hashedPassword });
        } catch (e) {
            // duplicated userName - PG error code # 23505
            if (e.code === '23505') {
                this._logger.warn(`Username "${dto.username}" already exists. Error: "${e.code}". Stack: ${e.stack}`, `/signup`);
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    public async signIn(dto: AuthCredentialsDto): Promise<{ accessToken: string; }> {
        const { username, password } = dto;
        const user = await this._usersRepository.findOneByUserName(username);
        if (!user) throw new UnauthorizedException('Please check your login credentials');
        const isValidUser = await bcrypt.compare(password ?? '', user.password)
        if (!isValidUser) throw new UnauthorizedException('Please check your login credentials')
        const payload: JwtPayload = { username };
        const accessToken = await this._jwtService.sign(payload);
        return { accessToken };
    }
}
