import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    public async findOneByUserName(username: string): Promise<User> {
        return await this.findOne({ username });
    }

    public async createOne(dto: AuthCredentialsDto): Promise<void> {
        const { username, password } = dto;
        const user = await this.create({ username, password });
        await this.save(user);
        return;
    }
}